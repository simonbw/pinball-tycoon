import BaseEntity from "./core/entity/BaseEntity";
import * as Pixi from "pixi.js";
import { LayerName } from "./core/Layers";
import Entity from "./core/entity/Entity";

interface ScoreEvent {
  type: "score";
  points: number;
}

export default class Scoreboard extends BaseEntity implements Entity {
  score: number = 0;
  layer: LayerName = "hud";
  handlers = { score: (e: ScoreEvent) => this.onScore(e) };

  constructor() {
    super();

    const text = new Pixi.Text(``, {
      fill: 0xff3333,
      fontFamily: ["DS Digital"],
      fontSize: 48,
      dropShadow: true,
      dropShadowBlur: 10,
      dropShadowColor: 0xff3333,
      dropShadowAlpha: 0.5,
      dropShadowDistance: 0,
    });
    text.anchor.set(1, 0);
    this.sprite = text;
    this.updateText();
  }

  onRender() {
    this.sprite.x = this.game.renderer.pixiRenderer.width / 2 - 5;
    this.sprite.y = 5;
  }

  updateText() {
    (this.sprite as Pixi.Text).text = `${this.score} pts`;
  }

  onScore({ points }: ScoreEvent) {
    this.score += points;
    this.updateText();
  }
}
