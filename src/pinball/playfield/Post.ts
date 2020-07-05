import BaseEntity from "../../core/entity/BaseEntity";
import { Graphics } from "pixi.js";
import { Body, Circle, Shape, ContactEquation } from "p2";
import { Vector } from "../../core/Vector";
import { Materials } from "../Materials";
import { CollisionGroups } from "./Collision";
import Ball, { isBall } from "./Ball";
import { clamp } from "../../core/util/MathUtil";
import Entity from "../../core/entity/Entity";
import { playSoundEvent } from "../Soundboard";

export default class Post extends BaseEntity implements Entity {
  constructor(position: Vector, size: number = 0.5, color: number = 0xddddee) {
    super();
    const graphics = new Graphics();

    graphics.beginFill(color);
    graphics.drawCircle(0, 0, size);
    graphics.endFill();

    graphics.position.set(...position);
    this.sprite = graphics;

    this.body = new Body({
      position: position,
      mass: 0,
    });

    const shape = new Circle({ radius: size });
    shape.material = Materials.bumper;
    shape.collisionGroup = CollisionGroups.Table;
    shape.collisionMask = CollisionGroups.Ball;
    this.body.addShape(shape);
  }

  onBeginContact(
    ball: Entity,
    _: Shape,
    __: Shape,
    contactEquations: ContactEquation[]
  ) {
    if (isBall(ball)) {
      const eq = contactEquations[0];
      const impact = Math.abs(eq.getVelocityAlongNormal());
      const pan = clamp(ball.getPosition()[0] / 40, -0.5, 0.5);
      const gain = clamp(impact / 50) ** 2;
      this.game!.dispatch(playSoundEvent("postHit", { pan, gain }));
    }
  }
}
