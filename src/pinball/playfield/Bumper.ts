import { Body, Circle } from "p2";
import { Graphics } from "pixi.js";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { clamp } from "../../core/util/MathUtil";
import { Vector } from "../../core/Vector";
import { Materials } from "./Materials";
import { isBall } from "./Ball";
import { CollisionGroups } from "./Collision";
import { playSoundEvent } from "../Soundboard";

const STRENGTH = 250;
const VELOCITY_MULTIPLIER = 0.2;
const EXPAND_AMOUNT = 0.15;
const ANIMATION_DURATION = 0.1;

export default class Bumper extends BaseEntity implements Entity {
  lastHit: number = -Infinity;

  constructor(position: Vector, size: number = 1.7) {
    super();
    const graphics = new Graphics();

    graphics.beginFill(0xffbb00);
    graphics.drawCircle(0, 0, size);
    graphics.endFill();
    graphics.beginFill(0xdd2200);
    graphics.drawCircle(0, 0, size * 0.8);
    graphics.endFill();
    graphics.beginFill(0xffbb00);
    // graphics.beginFill(0xdd2200);
    graphics.drawCircle(0, 0, size * 0.6);
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
      clamp(this.game!.elapsedTime - this.lastHit, 0, ANIMATION_DURATION) /
      ANIMATION_DURATION;
    const scale = (1 - animationPercent) * EXPAND_AMOUNT + 1;
    this.sprite!.scale.set(scale, scale);
  }

  onImpact(ball: Entity) {
    if (isBall(ball)) {
      ball.body.velocity[0] *= VELOCITY_MULTIPLIER;
      ball.body.velocity[1] *= VELOCITY_MULTIPLIER;
      const impulse = this.getPosition()
        .sub(ball.getPosition())
        .inormalize()
        .mul(-STRENGTH);
      ball.body.applyImpulse(impulse);

      this.game!.dispatch({ type: "score", points: 70 });

      const pan = clamp(this.getPosition()[0] / 30, -0.5, 0.5);
      this.game!.dispatch(playSoundEvent("pop1", { pan }));

      this.lastHit = this.game!.elapsedTime;
    }
  }
}
