import { Body, Box } from "p2";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { V2d } from "../../core/Vector";
import { isBall } from "../ball/Ball";
import { CollisionGroups } from "./Collision";

export default class Drain extends BaseEntity implements Entity {
  constructor(left: V2d, right: V2d) {
    super();
    const center = left.add(right).imul(0.5);
    const width = right.x - left.x;
    const height = 1;

    // const graphics = new Graphics();
    // graphics.beginFill(0x000000);
    // graphics.drawRect(left.x, left.y, width, height);

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
      this.game!.dispatch({ type: "drain", ball });
    }
  }
}
