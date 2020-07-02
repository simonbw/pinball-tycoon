import Entity from "../../core/entity/Entity";
import BaseEntity from "../../core/entity/BaseEntity";
import { Graphics } from "pixi.js";
import { Vector, V } from "../../core/Vector";
import { Body, Box } from "p2";
import { CollisionGroups } from "./Collision";
import { isBall } from "./Ball";

export default class Drain extends BaseEntity implements Entity {
  constructor(left: Vector, right: Vector) {
    super();
    const center = left.add(right).imul(0.5);
    const width = right.x - left.x;
    const height = 1;

    const graphics = new Graphics();
    graphics.beginFill(0x000000);
    graphics.drawRect(left.x, left.y, width, height);
    this.sprite = graphics;

    this.body = new Body({
      collisionResponse: false,
      position: center,
    });
    const shape = new Box({ width, height });
    shape.collisionGroup = CollisionGroups.Table;
    shape.collisionMask = CollisionGroups.Ball;
    this.body.addShape(shape);
  }

  onImpact(other: Entity) {
    if (isBall(other)) {
      const ball = other;
      ball.body.position = V([26, 95]);
      ball.body.velocity = V([0, 0]);

      this.game.dispatch({ type: "drain" });
    }
  }
}
