import BaseEntity from "../../core/entity/BaseEntity";
import { Graphics } from "pixi.js";
import { Body, Capsule } from "p2";
import { Vector } from "../../core/Vector";
import { Materials } from "../Materials";
import { CollisionGroups } from "./Collision";
import Entity from "../../core/entity/Entity";

export default class Wall extends BaseEntity implements Entity {
  constructor(
    start: Vector,
    end: Vector,
    width: number = 1.0,
    color: number = 0x0000ff
  ) {
    super();
    const graphics = new Graphics();

    const delta = end.sub(start);
    const center = start.add(delta.mul(0.5));

    graphics.moveTo(0, 0);
    graphics.lineStyle(width, color);
    graphics.lineTo(delta.x, delta.y);
    graphics.lineStyle();
    graphics.beginFill(color);
    graphics.drawCircle(0, 0, width / 2);
    graphics.drawCircle(delta.x, delta.y, width / 2);
    graphics.endFill();

    graphics.position.set(...start);
    this.sprite = graphics;

    this.body = new Body({
      position: center,
      angle: delta.angle,
      mass: 0,
    });

    const shape = new Capsule({
      length: delta.magnitude,
      radius: width / 2,
    });
    shape.material = Materials.wall;
    shape.collisionGroup = CollisionGroups.Table;
    shape.collisionMask = CollisionGroups.Ball;
    this.body.addShape(shape);
  }
}
