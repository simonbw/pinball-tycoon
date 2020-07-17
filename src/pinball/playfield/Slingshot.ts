import { Body, Capsule } from "p2";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { clamp, radToDeg, lerp, degToRad } from "../../core/util/MathUtil";
import { V2d } from "../../core/Vector";
import Ball from "../ball/Ball";
import { CollisionGroups } from "./Collision";
import { P2Materials } from "./Materials";
import SlingshotMesh from "./SlingshotMesh";
import Post from "./Post";
import { PositionalSound } from "../system/PositionalSound";

const DEAD_SPACE = 0.02;
const MAX_STRENGTH = 350;
const MIN_STRENGTH = 200;
const WIDTH = 0.5;
const ANGLE_DELTA = degToRad(20);

export default class Slingshot extends BaseEntity implements Entity {
  lastHit: number = -Infinity;
  body: Body;
  middlePercent: number;
  start: V2d;
  end: V2d;
  slingshotMesh: SlingshotMesh;

  constructor(
    start: V2d,
    end: V2d,
    middlePercent: number = 0.5,
    reverse: boolean = false
  ) {
    super();
    this.start = reverse ? end : start;
    this.end = reverse ? start : end;
    this.middlePercent = reverse ? 1.0 - middlePercent : middlePercent;

    const delta = this.end.sub(this.start);
    const center = this.start.add(delta.mul(0.5));
    this.body = new Body({
      position: center,
      angle: delta.angle,
      mass: 0,
    });

    const shape = new Capsule({ length: delta.magnitude, radius: WIDTH / 2 });
    shape.material = P2Materials.slingshot;
    shape.collisionGroup = CollisionGroups.Table;
    shape.collisionMask = CollisionGroups.Ball;
    this.body.addShape(shape);

    this.slingshotMesh = this.addChild(
      new SlingshotMesh(this.start, this.end, this.middlePercent)
    );

    this.addChildren(new Post(start, 0.6), new Post(end, 0.6));
  }

  getPercentAcross(C: V2d): number {
    const A = this.start;
    const B = this.end;
    const AB = B.sub(A);
    const AC = C.sub(A);
    const a = AC.dot(AB.normalize());
    return a / AB.magnitude;
  }

  onImpact(ball: Ball) {
    // TODO: This should respond to continued contact probably
    const impactLocation = this.getPercentAcross(ball.getPosition());
    const mid = this.middlePercent;
    const denominator = impactLocation < mid ? mid : 1.0 - mid;
    const midOffset = (impactLocation - mid) / denominator;
    const strenghtPercent = 1.0 - Math.abs(midOffset);
    const strength = lerp(MIN_STRENGTH, MAX_STRENGTH, strenghtPercent);
    const angle =
      -ANGLE_DELTA * Math.abs(midOffset) ** 0.4 * Math.sign(midOffset);

    if (impactLocation > DEAD_SPACE && impactLocation < 1 - DEAD_SPACE) {
      const impulse = this.end
        .sub(this.start)
        .irotate90ccw()
        .inormalize()
        .rotate(angle)
        .imul(strength);

      ball.capture();
      ball.release();
      ball.body.applyImpulse(impulse);

      this.game!.dispatch({ type: "score", points: 45 });

      this.addChild(
        new PositionalSound("boing1", this.getPosition(), { gain: 0.5 })
      );

      this.slingshotMesh.animationStartTime = this.game!.elapsedTime;
    }
  }
}
