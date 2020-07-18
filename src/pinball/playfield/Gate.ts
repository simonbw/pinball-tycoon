import { Body, Capsule, RevoluteConstraint } from "p2";
import { MeshStandardMaterial } from "three";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import Game from "../../core/Game";
import DampedRotationalSpring from "../../core/physics/DampedRotationalSpring";
import { V2d } from "../../core/Vector";
import {
  BallCollisionInfo,
  WithBallCollisionInfo,
} from "../ball/BallCollisionInfo";
import { CollisionGroups } from "../Collision";
import GateMesh from "./GateMesh";
import { P2Materials } from "./Materials";

export default class Gate extends BaseEntity
  implements Entity, WithBallCollisionInfo {
  body: Body;
  swingAmount: number;
  ballCollisionInfo: BallCollisionInfo = {
    beginContactSound: "gateHit",
  };

  constructor(
    public pivot: V2d,
    end: V2d,
    swingAmount: number = Math.PI,
    width: number = 0.5
  ) {
    super();
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
    p2Shape.material = P2Materials.wall;
    p2Shape.collisionGroup = CollisionGroups.Table;
    p2Shape.collisionMask = CollisionGroups.Ball;
    this.body.addShape(p2Shape, [0, 0], delta.angle);

    this.addChild(new GateMesh(this, end, width));
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
}
