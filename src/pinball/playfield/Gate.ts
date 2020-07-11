import { Body, Capsule, RevoluteConstraint } from "p2";
import {
  ExtrudeGeometry,
  Mesh,
  MeshStandardMaterial,
  Shape as ThreeShape,
} from "three";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import Game from "../../core/Game";
import DampedRotationalSpring from "../../core/physics/DampedRotationalSpring";
import { Vector } from "../../core/Vector";
import { BallCollisionInfo, WithBallCollisionInfo } from "../BallCollisionInfo";
import { CollisionGroups } from "./Collision";
import { Materials } from "./Materials";

const MATERIAL = new MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.0,
  metalness: 0.5,
});

export default class Gate extends BaseEntity
  implements Entity, WithBallCollisionInfo {
  body: Body;
  pivot: Vector;
  swingAmount: number;
  ballCollisionInfo: BallCollisionInfo = {
    beginContactSound: "gateHit",
  };

  constructor(
    pivot: Vector,
    end: Vector,
    swingAmount: number = Math.PI,
    width: number = 0.5
  ) {
    super();
    this.pivot = pivot;
    this.swingAmount = swingAmount;

    const delta = end.sub(pivot);
    const length = delta.magnitude;
    const position = pivot.add(delta.mul(0.5));

    this.body = new Body({
      position,
      mass: 0.18,
    });

    const p2Shape = new Capsule({
      length: length,
      radius: width / 2,
    });
    p2Shape.material = Materials.wall;
    p2Shape.collisionGroup = CollisionGroups.Table;
    p2Shape.collisionMask = CollisionGroups.Ball;
    this.body.addShape(p2Shape, [0, 0], delta.angle);

    const shape = new ThreeShape();
    const r = width / 2;
    shape.moveTo(0, -r);
    shape.lineTo(length, -r);
    shape.absarc(length, 0, r, 0, Math.PI / 2, false);
    shape.lineTo(0, r);
    shape.lineTo(0, -r);

    const geometry = new ExtrudeGeometry(shape, {
      bevelEnabled: false,
      depth: 1,
    });
    geometry.rotateZ(delta.angle);
    this.mesh = new Mesh(geometry, MATERIAL);
    this.mesh.position.set(pivot.x, pivot.y, -1.5);

    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
  }

  onAdd(game: Game) {
    const hinge = new RevoluteConstraint(this.body, game.ground, {
      worldPivot: this.pivot,
    });
    if (this.swingAmount > 0) {
      hinge.setLimits(0, this.swingAmount);
    } else {
      hinge.setLimits(this.swingAmount, 0);
    }
    hinge.lowerLimitEnabled = true;
    hinge.upperLimitEnabled = true;
    this.constraints = [hinge];

    const spring = new DampedRotationalSpring(this.body, game.ground, {
      stiffness: 80,
      damping: 3,
    });
    this.springs = [spring];
  }

  onRender() {
    this.mesh!.rotation.z = this.body.angle;
  }
}
