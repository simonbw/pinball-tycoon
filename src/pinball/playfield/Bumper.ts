import { Body, Circle } from "p2";
import { CylinderBufferGeometry, Mesh, MeshStandardMaterial } from "three";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { clamp, degToRad } from "../../core/util/MathUtil";
import { V2d } from "../../core/Vector";
import { isBall } from "../ball/Ball";
import { scoreEvent } from "../system/LogicBoard";
import { PositionalSound } from "../system/PositionalSound";
import { CollisionGroups } from "./Collision";
import { P2Materials } from "./Materials";
import BumperMesh from "./BumperMesh";
import { rNormal } from "../../core/util/Random";

const STRENGTH = 250;

export default class Bumper extends BaseEntity implements Entity {
  lastHit: number = -Infinity;
  body: Body;

  constructor(position: V2d, size: number = 1.7) {
    super();

    this.body = new Body({
      position: position,
      mass: 0,
    });

    const shape = new Circle({ radius: size * 0.6 });
    shape.material = P2Materials.bumper;
    shape.collisionGroup = CollisionGroups.Table;
    shape.collisionMask = CollisionGroups.Ball;
    this.body.addShape(shape);

    this.addChild(new BumperMesh(this, size));
  }

  async onImpact(ball: Entity) {
    if (isBall(ball)) {
      this.game!.dispatch(scoreEvent(700));
      this.addChild(new PositionalSound("pop1", this.getPosition()));
      const impulse = ball
        .getPosition()
        .sub(this.getPosition())
        .inormalize()
        .irotate(rNormal(0.0, degToRad(5)))
        .mul(STRENGTH);
      ball.capture();
      this.lastHit = this.game!.elapsedTime;

      await this.wait(0.016);
      ball.release();
      ball.body.applyImpulse(impulse);
    }
  }
}
