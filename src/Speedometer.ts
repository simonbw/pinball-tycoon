import BaseEntity from "./core/entity/BaseEntity";
import * as Pixi from "pixi.js";
import { LayerName } from "./core/Layers";
import Ball from "./pinball/playfield/Ball";
import { V } from "./core/Vector";
import Entity from "./core/entity/Entity";

interface ScoreEvent {
  type: "score";
  points: number;
}

export default class Speedometer extends BaseEntity implements Entity {
  score: number = 0;
  layer: LayerName = "hud";

  constructor() {
    super();

    const text = new Pixi.Text("", {
      fill: 0xff3333,
      fontFamily: ["DS Digital"],
      fontSize: 32,
      dropShadow: true,
      dropShadowBlur: 10,
      dropShadowColor: 0xff3333,
      dropShadowAlpha: 0.5,
      dropShadowDistance: 0,
    });
    text.anchor.set(1, 0);
    this.sprite = text;
  }

  onRender() {
    const ball = this.game.entities.getTagged("ball")[0] as Ball;
    const speed = V(ball.body.velocity).magnitude;
    this.sprite.x = this.game.renderer.pixiRenderer.width / 2 - 5;
    this.sprite.y = 45;

    if (this.game.framenumber % 5 == 0) {
      (this.sprite as Pixi.Text).text = `${(speed / 17.6).toFixed(1)} mph`;
    }
  }
}
