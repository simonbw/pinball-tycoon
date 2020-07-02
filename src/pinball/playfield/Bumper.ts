import BaseEntity from "../../core/entity/BaseEntity";
import { Graphics } from "pixi.js";
import { Body, Circle } from "p2";
import { Vector } from "../../core/Vector";
import { Materials } from "../Materials";
import { CollisionGroups } from "./Collision";
import Ball, { isBall } from "./Ball";
import { clamp } from "../../core/util/MathUtil";
import Entity from "../../core/entity/Entity";

const STRENGTH = 300;

const EXPAND_AMOUNT = 0.15;
const ANIMATION_DURATION = 0.1;

export default class Bumper extends BaseEntity implements Entity {
  lastHit: number = -Infinity;

  constructor(position: Vector, size: number = 1.7) {
    super();
    const graphics = new Graphics();

    graphics.beginFill(0xff4400);
    graphics.drawCircle(0, 0, size);
    graphics.endFill();
    graphics.beginFill(0xffaa00);
    graphics.drawCircle(0, 0, size * 0.8);
    graphics.endFill();

    graphics.position.set(...position);
    this.sprite = graphics;

    this.body = new Body({
      position: position,
      mass: 0,
    });

    const shape = new Circle({ radius: size * 0.8 });
    shape.material = Materials.bumper;
    shape.collisionGroup = CollisionGroups.Table;
    shape.collisionMask = CollisionGroups.Ball;
    this.body.addShape(shape);
  }

  onRender() {
    const animationPercent =
      clamp(this.game.elapsedTime - this.lastHit, 0, ANIMATION_DURATION) /
      ANIMATION_DURATION;
    const scale = (1 - animationPercent) * EXPAND_AMOUNT + 1;
    this.sprite.scale.set(scale, scale);
  }

  onImpact(ball: Entity) {
    if (isBall(ball)) {
      console.log(this.getPosition());
      const impulse = this.getPosition()
        .sub(ball.getPosition())
        .inormalize()
        .mul(-STRENGTH);
      ball.body.applyImpulse(impulse);

      this.game.dispatch({ type: "score", points: 70 });

      this.lastHit = this.game.elapsedTime;
    }
  }
}
