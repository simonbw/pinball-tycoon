import { Body, Capsule, RevoluteConstraint, RotationalSpring } from "p2";
import { ExtrudeGeometry, Mesh, MeshStandardMaterial, Shape } from "three";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { CustomHandlersMap } from "../../core/entity/GameEventHandler";
import Game from "../../core/Game";
import DampedRotationalSpring from "../../core/physics/DampedRotationalSpring";
import { angleDelta, degToRad, reflectX } from "../../core/util/MathUtil";
import { Vector } from "../../core/Vector";
import { BallCollisionInfo, WithBallCollisionInfo } from "../BallCollisionInfo";
import { getBinding } from "../ui/KeyboardBindings";
import { CollisionGroups } from "./Collision";
import { Materials } from "./Materials";

const MATERIAL = new MeshStandardMaterial({
  color: 0x554411,
  roughness: 0.7,
});

const DOWN_ANGLE = degToRad(30);
const UP_ANGLE = degToRad(-38);
const UP_STIFFNESS = 80000;
const DOWN_STIFFNESS = 30000;
const DAMPING = 1250;
const OVEREXTENSION_AMOUNT = degToRad(3);
const WIDTH = 1.2;
const MASS = 2.2;

type Side = "left" | "right";

export default class Flipper extends BaseEntity
  implements Entity, WithBallCollisionInfo {
  body: Body;
  joint?: RevoluteConstraint;
  spring!: RotationalSpring;
  downAngle: number;
  upAngle: number;
  side: Side;
  locked: boolean = false;
  engaged: boolean = false;
  handlers: CustomHandlersMap = {};

  ballCollisionInfo: BallCollisionInfo = {
    beginContactSound: "wallHit1",
  };

  constructor(
    position: Vector,
    side: Side = "left",
    length: number = 6,
    upAngle = UP_ANGLE,
    downAngle = DOWN_ANGLE
  ) {
    super();
    this.side = side;

    switch (side) {
      case "left":
        this.upAngle = upAngle;
        this.downAngle = downAngle;
        this.handlers["leftFlipperUp"] = () => (this.engaged = true);
        this.handlers["leftFlipperDown"] = () => (this.engaged = false);
        break;
      case "right":
        this.upAngle = reflectX(upAngle) + 2 * Math.PI;
        this.downAngle = reflectX(downAngle);
        this.handlers["rightFlipperUp"] = () => (this.engaged = true);
        this.handlers["rightFlipperDown"] = () => (this.engaged = false);
        break;
    }

    this.body = new Body({
      position: position,
      mass: MASS,
      angle: this.downAngle + Math.PI / 2,
      fixedX: true,
      fixedY: true,
    });

    const p2Shape = new Capsule({
      length: length,
      radius: WIDTH / 2,
    });
    p2Shape.material = Materials.flipper;
    p2Shape.collisionGroup = CollisionGroups.Table;
    p2Shape.collisionMask = CollisionGroups.Ball;
    this.body.addShape(p2Shape, [length / 2, 0]);

    const shape = new Shape();
    const r = WIDTH / 2;
    shape.moveTo(0, -r);
    shape.lineTo(length, -r);
    shape.absarc(length, 0, r, -Math.PI / 2, Math.PI / 2, false);
    shape.lineTo(0, r);
    shape.lineTo(0, -r);

    const geometry = new ExtrudeGeometry(shape, {
      bevelEnabled: false,
      depth: 1,
    });
    this.mesh = new Mesh(geometry, MATERIAL);
    this.mesh.position.set(position.x, position.y, -1.5);

    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
  }

  onAdd(game: Game) {
    this.joint = new RevoluteConstraint(game.ground, this.body, {
      worldPivot: this.body.position,
    });
    if (this.side === "left") {
      this.joint.setLimits(this.upAngle - OVEREXTENSION_AMOUNT, this.downAngle);
    } else {
      this.joint.setLimits(this.downAngle, this.upAngle + OVEREXTENSION_AMOUNT);
    }
    this.constraints = [this.joint];

    this.spring = new DampedRotationalSpring(game.ground, this.body, {
      stiffness: DOWN_STIFFNESS,
      damping: DAMPING,
      restAngle: this.downAngle,
    });

    this.springs = [this.spring];

    const controlName = this.side === "left" ? "LEFT_FLIPPER" : "RIGHT_FLIPPER";
    const key = getBinding(controlName);
    this.engaged = game.io.keyIsDown(key);
  }

  onRender() {
    this.mesh!.rotation.z = this.body.angle;
  }

  shouldLock() {
    const angle = this.body.angle;
    const targetAngle = this.spring.restAngle;
    const speed = Math.abs(this.body.angularVelocity);
    const offset = Math.abs(angleDelta(angle, targetAngle));
    return offset < 0.05 && speed < 0.5;
  }

  lock() {
    this.locked = true;
    this.body.type = Body.STATIC;
    this.body.angularVelocity = 0;
    this.body.updateMassProperties();
  }

  unlock() {
    this.locked = false;
    this.body.type = Body.DYNAMIC;
    this.body.mass = MASS;
    this.body.updateMassProperties();
  }

  onTick() {
    this.spring.restAngle = this.engaged ? this.upAngle : this.downAngle;
    this.spring.stiffness = this.engaged ? UP_STIFFNESS : DOWN_STIFFNESS;

    const shouldLock = this.shouldLock();
    if (!this.locked && shouldLock) {
      this.lock();
    } else if (this.locked && !shouldLock) {
      this.unlock();
    }
  }
}
