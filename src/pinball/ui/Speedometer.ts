import * as Pixi from "pixi.js";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { isBall } from "../playfield/Ball";
import { LAYERS } from "../layers";

const IPS_TO_MPH = 1 / 17.6;

interface ScoreEvent {
  type: "score";
  points: number;
}

export default class Speedometer extends BaseEntity implements Entity {
  score: number = 0;
  sprite: Pixi.Text & GameSprite;

  constructor() {
    super();

    this.sprite = new Pixi.Text("", {
      fill: 0xff3333,
      fontFamily: ["DS Digital"],
      fontSize: 32,
      dropShadow: true,
      dropShadowBlur: 10,
      dropShadowColor: 0xff3333,
      dropShadowAlpha: 0.5,
      dropShadowDistance: 0,
    });
    this.sprite.layerName = LAYERS.hud;
    this.sprite.anchor.set(1, 0);
  }

  onRender() {
    this.sprite.x = this.game!.renderer.pixiRenderer.width / 2 - 5;
    this.sprite.y = 45;

    const ball = this.game!.entities.getTagged("ball")[0];
    if (isBall(ball)) {
      const speed = ball.body!.velocity.magnitude * IPS_TO_MPH;
      if (this.game!.framenumber % 5 == 0) {
        this.sprite.text = `${speed.toFixed(1)} mph`;
      }
    } else {
      this.sprite.text = `${(0).toFixed(1)} mph`;
    }
  }
}
