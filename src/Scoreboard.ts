import BaseEntity from "./core/entity/BaseEntity";
import * as Pixi from "pixi.js";
import { LayerName } from "./core/Layers";
import Entity from "./core/entity/Entity";

interface ScoreEvent {
  type: "score";
  points: number;
}

export default class Scoreboard extends BaseEntity implements Entity {
  highScore: number = 0;
  score: number = 0;
  ballsLeft: number = 2;
  layer: LayerName = "hud";

  handlers = {
    score: (e: ScoreEvent) => this.onScore(e),
    drain: () => this.onDrain(),
  };

  constructor() {
    super();
    this.loadHighScore();

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

  loadHighScore() {
    this.highScore = parseInt(localStorage.getItem("highScore")) || 0;
  }

  saveHighScore() {
    localStorage.setItem("highScore", String(this.highScore));
  }

  updateText() {
    const newText = `${"◌".repeat(this.ballsLeft + 1)} ${this.score} pts`;
    (this.sprite as Pixi.Text).text = newText;
  }

  onScore({ points }: ScoreEvent) {
    this.score += points;
    this.updateText();
  }

  onDrain() {
    if (this.ballsLeft > 0) {
      this.ballsLeft -= 1;
    } else {
      this.ballsLeft = 2;
      this.highScore = Math.max(this.score, this.highScore);
      this.score = 0;
      this.saveHighScore();
    }
    this.updateText();
  }
}
