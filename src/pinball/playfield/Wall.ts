import { Body, Capsule } from "p2";
import { Graphics } from "pixi.js";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { Vector } from "../../core/Vector";
import { WithBallCollisionInfo, BallCollisionInfo } from "../BallCollisionInfo";
import { CollisionGroups } from "./Collision";
import { Materials } from "./Materials";
import { colorFade } from "../../core/util/ColorUtils";
import { LAYERS } from "../layers";

export default class Wall extends BaseEntity
  implements Entity, WithBallCollisionInfo {
  tags = ["wall"];
  sprites: GameSprite[];
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

    const topSprite = this.makeSprite(delta, width, color);
    topSprite.position.set(...start);
    topSprite.layerName = LAYERS.mainfield_top;

    const middleColor = colorFade(color, 0x000000, 0.2);
    const middleSprite = this.makeSprite(delta, width, middleColor);
    middleSprite.position.set(...start);
    middleSprite.layerName = LAYERS.mainfield_middle;

    const bottomColor = colorFade(color, 0x000000, 0.4);
    const bottomSprite = this.makeSprite(delta, width, bottomColor);
    bottomSprite.position.set(...start);
    bottomSprite.layerName = LAYERS.mainfield_bottom;

    this.sprites = [topSprite, middleSprite, bottomSprite];

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

  makeSprite(delta: Vector, width: number, color: number): GameSprite {
    const graphics = new Graphics();
    graphics.moveTo(0, 0);
    graphics.lineStyle(width, color);
    graphics.lineTo(delta.x, delta.y);
    graphics.lineStyle();
    graphics.beginFill(color);
    graphics.drawCircle(0, 0, width / 2);
    graphics.drawCircle(delta.x, delta.y, width / 2);
    graphics.endFill();

    return graphics;
  }
}
