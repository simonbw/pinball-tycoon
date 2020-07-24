import { Body, Capsule, ContactEquation, Shape } from "p2";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { clamp, radToDeg, lerp, degToRad } from "../../core/util/MathUtil";
import { V2d } from "../../core/Vector";
import Ball, { isBall } from "../ball/Ball";
import { CollisionGroups } from "../Collision";
import { P2Materials } from "./P2Materials";
import SlingshotMesh from "./SlingshotMesh";
import Post from "./Post";
import { PositionalSound } from "../sound/PositionalSound";

interface SlingshotOptions {
  /** Percent along string where the kicker is  */
  middleOffset?: number;
  /** Impulse strength at the very ends  */
  minStrength?: number;
  /** Impulse strength at the kicker  */
  maxStrength?: number;
  /** Minimum relative speed to trigger kicker  */
  triggerSpeed?: number;
  /** Width of the band in 1/2 inches  */
  width?: number;
  /** Amount of angle variation of impulse due to midpoint offset  */
  angleSpread?: number;
}

export default class Slingshot extends BaseEntity implements Entity {
  lastHit: number = -Infinity;
  body: Body;
  slingshotMesh: SlingshotMesh;

  middleOffset: number;
  minStrength: number;
  maxStrength: number;
  triggerSpeed: number;
  angleSpread: number;

  constructor(
    public start: V2d,
    public end: V2d,
    options: SlingshotOptions = {}
  ) {
    super();
    this.middleOffset = options.middleOffset ?? 0.5;
    this.minStrength = options.minStrength ?? 200;
    this.maxStrength = options.maxStrength ?? 350;
    this.triggerSpeed = options.triggerSpeed ?? 6;
    this.angleSpread = options.angleSpread ?? degToRad(10);
    const width = options.width ?? 0.5;

    const delta = this.end.sub(this.start);
    const center = this.start.add(delta.mul(0.5));
    this.body = new Body({
      position: center,
      angle: delta.angle,
      mass: 0,
    });

    const shape = new Capsule({
      length: delta.magnitude,
      radius: (width / 2) * 0.9,
    });
    shape.material = P2Materials.slingshot;
    shape.collisionGroup = CollisionGroups.Table;
    shape.collisionMask = CollisionGroups.Ball;
    this.body.addShape(shape);

    this.slingshotMesh = this.addChild(
      new SlingshotMesh(this.start, this.end, this.middleOffset, width)
    );

    this.addChildren(new Post(start, width * 1.0), new Post(end, width * 1.0));
  }

  getPercentAcross(C: V2d): number {
    const A = this.start;
    const B = this.end;
    const AB = B.sub(A);
    const AC = C.sub(A);
    const a = AC.dot(AB.normalize());
    return a / AB.magnitude;
  }

  getMidOffset(position: V2d): number {
    const impactLocation = this.getPercentAcross(position);
    const mid = this.middleOffset;
    const denominator = impactLocation < mid ? mid : 1.0 - mid;
    return (impactLocation - mid) / denominator;
  }

  onBeginContact(ball: Ball, _: Shape, __: Shape, eqs: ContactEquation[]) {
    if (isBall(ball)) {
      const midOffset = this.getMidOffset(ball.getPosition());
      const strengthPercent = 1.0 - Math.abs(midOffset);
      const strength = lerp(
        this.minStrength,
        this.maxStrength,
        strengthPercent
      );
      const angle =
        -this.angleSpread * Math.abs(midOffset) ** 0.2 * Math.sign(midOffset);
      const impactSpeed =
        strengthPercent * Math.abs(eqs[0].getVelocityAlongNormal());

      if (impactSpeed > this.triggerSpeed) {
        const impulse = this.end
          .sub(this.start)
          .irotate90ccw()
          .inormalize()
          .rotate(angle)
          .imul(strength);

        ball.body.velocity[0] *= 0.0;
        ball.body.velocity[1] *= 0.0;
        ball.body.applyImpulse(impulse);

        this.game!.dispatch({ type: "score", points: 45 });

        this.addChild(
          new PositionalSound("boing1", this.getPosition(), { gain: 0.5 })
        );

        this.slingshotMesh.animationStartTime = this.game!.elapsedTime;
      }
    }
  }
}
