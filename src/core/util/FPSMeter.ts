import * as Pixi from "pixi.js";
import BaseEntity from "../entity/BaseEntity";
import Entity from "../entity/Entity";
import Game from "../Game";

export default class FPSMeter extends BaseEntity implements Entity {
  layer: "hud" = "hud";
  persistent = true;

  lastUpdate: number;
  averageDuration: number = 0;
  sprite: Pixi.Text;
  slowFrameCount: number = 0;

  constructor() {
    super();
    this.sprite = new Pixi.Text("Super Pod Racer", {
      fontSize: "12px",
      fill: 0x000000,
    });
    this.sprite.x = 10;
    this.sprite.y = 10;
    this.lastUpdate = performance.now();
  }

  onAdd(game: Game) {
    this.averageDuration = game.renderTimestep;
  }

  onRender() {
    const now = performance.now();
    const duration = now - this.lastUpdate;
    this.averageDuration = 0.9 * this.averageDuration + 0.1 * duration;
    this.lastUpdate = now;
    this.sprite.text = String(Math.round(1000 / this.averageDuration));
  }
}
