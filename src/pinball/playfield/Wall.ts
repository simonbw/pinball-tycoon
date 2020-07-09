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

    const topSprite = this.makeSprite(delta, width, color, start);
    topSprite.layerName = LAYERS.mainfield_5;

    const middleColor1 = colorFade(color, 0x000000, 0.1);
    const middleSprite1 = this.makeSprite(delta, width, middleColor1, start);
    middleSprite1.layerName = LAYERS.mainfield_4;

    const middleColor2 = colorFade(color, 0x000000, 0.2);
    const middleSprite2 = this.makeSprite(delta, width, middleColor2, start);
    middleSprite2.layerName = LAYERS.mainfield_3;

    const middleColor3 = colorFade(color, 0x000000, 0.3);
    const middleSprite3 = this.makeSprite(delta, width, middleColor3, start);
    middleSprite3.layerName = LAYERS.mainfield_2;

    const bottomColor = colorFade(color, 0x000000, 0.4);
    const bottomSprite = this.makeSprite(delta, width, bottomColor, start);
    bottomSprite.layerName = LAYERS.mainfield_1;

    this.sprites = [
      topSprite,
      middleSprite1,
      middleSprite2,
      middleSprite3,
      bottomSprite,
    ];

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

  makeSprite(
    delta: Vector,
    width: number,
    color: number,
    position: Vector
  ): GameSprite {
    const graphics = new Graphics();
    graphics.moveTo(0, 0);
    graphics.lineStyle(width, color);
    graphics.lineTo(delta.x, delta.y);
    graphics.lineStyle();
    graphics.beginFill(color);
    graphics.drawCircle(0, 0, width / 2);
    graphics.drawCircle(delta.x, delta.y, width / 2);
    graphics.endFill();
    graphics.position.set(...position);
    return graphics;
  }
}
