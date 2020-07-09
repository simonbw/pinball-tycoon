import { Body, Capsule } from "p2";
import { Graphics } from "pixi.js";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { Vector } from "../../core/Vector";
import { WithBallCollisionInfo, BallCollisionInfo } from "../BallCollisionInfo";
import { CollisionGroups } from "./Collision";
import { Materials } from "./Materials";
import { colorFade } from "../../core/util/ColorUtils";

export default class Wall extends BaseEntity
  implements Entity, WithBallCollisionInfo {
  tags = ["wall"];
  sprite = new Graphics();
  ballCollisionInfo: BallCollisionInfo;

  constructor(
    start: Vector,
    end: Vector,
    width: number = 1.0,
    color: number = 0x3355ff
  ) {
    super();

    const delta = end.sub(start);
    const center = start.add(delta.mul(0.5));

    this.sprite.moveTo(0, 0);
    this.sprite.lineStyle(width, color);
    this.sprite.lineTo(delta.x, delta.y);
    this.sprite.lineStyle();
    this.sprite.beginFill(color);
    this.sprite.drawCircle(0, 0, width / 2);
    this.sprite.drawCircle(delta.x, delta.y, width / 2);
    this.sprite.endFill();
    this.sprite.position.set(...start);

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

    this.ballCollisionInfo = {
      beginContactSound: "wallHit1",
      sparkInfo: {
        color: colorFade(color, 0xffffff, 0.5),
        maxBegin: 3,
        maxDuring: 1,
        minDuring: 0,
        impactMultiplier: 1,
        size: 0.15,
      },
    };
  }
}

export function isWall(e?: Entity): e is Wall {
  return e instanceof Wall;
}
