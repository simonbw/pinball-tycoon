import { Body, Box, ContactEquation, Shape as P2Shape } from "p2";
import { BoxBufferGeometry, Mesh, MeshPhongMaterial } from "three";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { CustomHandlersMap } from "../../core/entity/GameEventHandler";
import { clamp } from "../../core/util/MathUtil";
import { Vector } from "../../core/Vector";
import { isBall } from "../ball/Ball";
import {
  BallCollisionInfo,
  WithBallCollisionInfo,
} from "../ball/BallCollisionInfo";
import { playSoundEvent } from "../Soundboard";
import { CollisionGroups } from "./Collision";
import { P2Materials } from "./Materials";
import { scoreEvent } from "../LogicBoard";

const UP_SPEED = 15.0;
const DOWN_SPEED = 100.0;

const MATERIAL = new MeshPhongMaterial({
  color: 0xffaa00,
});

// TODO: Try composition instead of inheritance
export default class DropTarget extends BaseEntity
  implements Entity, WithBallCollisionInfo {
  body: Body;
  p2Shape: P2Shape;
  mesh: Mesh;
  up: boolean = true;
  height: number;
  dropForce: number;
  resetTime: number;
  ballCollisionInfo: BallCollisionInfo = {
    beginContactSound: "wallHit1",
  };

  constructor(
    position: Vector,
    angle: number = 0,
    width: number = 2.0,
    height?: number,
    dropForce: number = 20,
    resetTime: number = 20
  ) {
    super();

    this.dropForce = dropForce;
    this.resetTime = resetTime;

    this.height = height = height ?? width * 1.5;
    const depth = 0.2;

    this.body = new Body({ position, angle });
    this.p2Shape = new Box({ width: width, height: depth });
    this.p2Shape.material = P2Materials.dropTarget;
    this.p2Shape.collisionGroup = CollisionGroups.Table;
    this.p2Shape.collisionMask = CollisionGroups.Ball;
    this.p2Shape.material = P2Materials.dropTarget;
    this.body.addShape(this.p2Shape);

    this.mesh = new Mesh(
      this.getGeometry(width, height, depth),
      this.getMaterial()
    );
    this.mesh.position.set(position.x, position.y, 0);
    this.mesh.rotateZ(angle);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
  }

  getGeometry(width: number, height: number, depth: number) {
    const geometry = new BoxBufferGeometry(width, height, depth);
    geometry.rotateX(Math.PI / 2);
    geometry.translate(0, 0, -height / 2);
    return geometry;
  }

  getMaterial() {
    return MATERIAL;
  }

  get z() {
    return this.mesh.position.z;
  }

  set z(value: number) {
    this.mesh.position.z = value;
  }

  get downZ() {
    return this.height + 0.1;
  }

  onTick(dt: number) {
    if (this.up) {
      if (this.z > 0) {
        this.z = Math.max(this.z - dt * UP_SPEED, 0);
      }
    } else if (this.z < this.downZ) {
      this.z = Math.min(this.z + dt * DOWN_SPEED, this.downZ);
    }
  }

  async lower(raiseDelay: number = this.resetTime) {
    if (this.up) {
      this.up = false;
      await this.wait();
      this.p2Shape.collisionGroup = CollisionGroups.None;

      if (raiseDelay) {
        await this.wait(raiseDelay);
        this.raise();
      }
    }
  }

  raise() {
    this.clearTimers();
    this.up = true;
    this.body.collisionResponse = true;
    this.p2Shape.collisionGroup = CollisionGroups.Table;
  }

  onDrop() {
    this.game!.dispatch(scoreEvent(200));
    const pan = clamp(this.getPosition()[0] / 30, -0.5, 0.5);
    this.game!.dispatch(playSoundEvent("pop1", { pan }));
  }

  handlers: CustomHandlersMap = {
    newBall: () => {
      this.raise();
    },
  };

  async onBeginContact(
    ball: Entity,
    _: P2Shape,
    __: P2Shape,
    equations: ContactEquation[]
  ) {
    if (isBall(ball)) {
      const impact = Math.abs(equations[0].getVelocityAlongNormal());

      if (impact > this.dropForce) {
        this.lower();
        this.onDrop();
      }
    }
  }
}
