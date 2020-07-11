import { Body, Capsule } from "p2";
import {
  CurvePath,
  LineCurve3,
  Mesh,
  MeshStandardMaterial,
  TubeGeometry,
  Vector3,
} from "three";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { clamp } from "../../core/util/MathUtil";
import { Vector } from "../../core/Vector";
import Ball from "./Ball";
import { CollisionGroups } from "./Collision";
import { Materials } from "./Materials";

const DEAD_SPACE = 0.03;
const STRENGTH = 400;
const EXPAND_AMOUNT = 0.8;
const ANIMATION_DURATION = 0.07;
const WIDTH = 0.5;

const MATERIAL = new MeshStandardMaterial({
  color: 0x111111,
  roughness: 0.7,
});

export default class Slingshot extends BaseEntity implements Entity {
  lastHit: number = -Infinity;
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

    const delta = this.end.sub(this.start);
    const center = this.start.add(delta.mul(0.5));
    this.body = new Body({
      position: center,
      angle: delta.angle,
      mass: 0,
    });

    const shape = new Capsule({ length: delta.magnitude, radius: WIDTH / 2 });
    shape.material = Materials.slingshot;
    shape.collisionGroup = CollisionGroups.Table;
    shape.collisionMask = CollisionGroups.Ball;
    this.body.addShape(shape);

    const midpoint = start.add(end).imul(0.5);
    const curve = new CurvePath<Vector3>();
    curve.add(
      new LineCurve3(
        new Vector3(start.x, start.y, 0),
        new Vector3(midpoint.x, midpoint.y, 0)
      )
    );
    curve.add(
      new LineCurve3(
        new Vector3(midpoint.x, midpoint.y, 0),
        new Vector3(end.x, end.y, 0)
      )
    );

    const geometry = new TubeGeometry(curve, 2, 0.3);
    geometry.translate(0, 0, -1);
    this.mesh = new Mesh(geometry, MATERIAL);
  }

  makeBody() {}

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

    // this.sprite.clear();
    // this.sprite.lineStyle(WIDTH, this.color);
    // this.sprite.moveTo(start.x, start.y);
    // this.sprite.lineTo(midpoint.x, midpoint.y);
    // this.sprite.moveTo(midpoint.x, midpoint.y);
    // this.sprite.lineTo(end.x, end.y);
    // this.sprite.lineStyle();
    // this.sprite.beginFill(this.color);
    // this.sprite.drawCircle(midpoint.x, midpoint.y, WIDTH / 2);
    // this.sprite.endFill();
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
