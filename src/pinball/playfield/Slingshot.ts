import BaseEntity from "../../core/entity/BaseEntity";
import { Graphics } from "pixi.js";
import { Body, Capsule } from "p2";
import { Vector } from "../../core/Vector";
import { Materials } from "../Materials";
import { CollisionGroups } from "./Collision";
import Ball from "./Ball";
import { clamp } from "../../core/util/MathUtil";
import Entity from "../../core/entity/Entity";

const DEAD_SPACE = 0.05;
const STRENGTH = 400;
const EXPAND_AMOUNT = 0.8;
const ANIMATION_DURATION = 0.07;
const WIDTH = 0.8;

export default class Slingshot extends BaseEntity implements Entity {
  lastHit: number = -Infinity;
  sprite: Graphics;
  body: Body;
  middlePercent: number;
  color: number;
  start: Vector;
  end: Vector;

  constructor(
    start: Vector,
    end: Vector,
    middlePercent: number = 0.5,
    reverse: boolean = false,
    color: number = 0x000000
  ) {
    super();
    if (reverse) {
      this.start = end;
      this.end = start;
    } else {
      this.start = start;
      this.end = end;
    }
    this.color = color;
    this.middlePercent = reverse ? 1.0 - middlePercent : middlePercent;

    this.sprite = new Graphics();
    this.body = this.makeBody();
  }

  makeBody() {
    const delta = this.end.sub(this.start);
    const center = this.start.add(delta.mul(0.5));
    const body = new Body({
      position: center,
      angle: delta.angle,
      mass: 0,
    });

    const shape = new Capsule({
      length: delta.magnitude,
      radius: WIDTH / 2,
    });
    shape.material = Materials.slingshot;
    shape.collisionGroup = CollisionGroups.Table;
    shape.collisionMask = CollisionGroups.Ball;
    body.addShape(shape);

    return body;
  }

  getNormal(): Vector {
    return this.end.sub(this.start).irotate90ccw().inormalize();
  }

  getAnimationPercent(): number {
    const timeSinceHit = this.game!.elapsedTime - this.lastHit;
    return clamp(timeSinceHit, 0, ANIMATION_DURATION) / ANIMATION_DURATION;
  }

  onRender() {
    const { start, end } = this;

    const displacement = this.getNormal().imul(
      (1.0 - this.getAnimationPercent()) * EXPAND_AMOUNT
    );
    const midpoint = start.add(end).imul(0.5).iadd(displacement);

    this.sprite.clear();
    this.sprite.lineStyle(WIDTH, this.color);
    this.sprite.moveTo(start.x, start.y);
    this.sprite.lineTo(midpoint.x, midpoint.y);
    this.sprite.moveTo(midpoint.x, midpoint.y);
    this.sprite.lineTo(end.x, end.y);
    this.sprite.lineStyle();
    this.sprite.beginFill(this.color);
    this.sprite.drawCircle(midpoint.x, midpoint.y, WIDTH / 2);
    this.sprite.endFill();
  }

  getPercentAcross(C: Vector): number {
    const A = this.start;
    const B = this.end;
    const AB = B.sub(A);
    const AC = C.sub(A);

    const a = AC.dot(AB.normalize());
    const p = a / AB.magnitude;

    return p;
  }

  onImpact(ball: Ball) {
    // TODO: This should respond to continued contact probably
    const impactLocation = this.getPercentAcross(ball.getPosition());

    if (impactLocation > DEAD_SPACE && impactLocation < 1 - DEAD_SPACE) {
      const impulse = this.getNormal().imul(STRENGTH);
      ball.body.applyImpulse(impulse);

      this.game!.dispatch({ type: "score", points: 10 });
      this.game!.dispatch({
        type: "playSound",
        sound: "boing1",
        pan: clamp(this.body!.position[0] / 40, -0.5, 0.5),
      });

      this.lastHit = this.game!.elapsedTime;
    }
  }
}
