import { Body, Box } from "p2";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { V } from "../../core/Vector";
import { isBall } from "../ball/Ball";
import { CollisionGroups } from "../Collision";
import { Rect } from "../util/Rect";

export default class Drain extends BaseEntity implements Entity {
  constructor({ width, height, center }: Rect) {
    super();

    this.body = new Body({
      collisionResponse: false,
      position: center.clone(),
    });
    const shape = new Box({ width, height });
    shape.collisionGroup = CollisionGroups.Table;
    shape.collisionMask = CollisionGroups.Ball;
    this.body.addShape(shape);
  }

  async onBeginContact(other: Entity) {
    if (isBall(other)) {
      const ball = other;
      this.game!.dispatch({ type: "drain", ball });
    }
  }
}
