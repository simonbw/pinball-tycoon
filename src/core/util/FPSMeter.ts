import * as Pixi from "pixi.js";
import BaseEntity from "../entity/BaseEntity";
import Entity, { GameSprite } from "../entity/Entity";
import Game from "../Game";
import { Vector } from "../Vector";
import { LAYERS } from "../../pinball/layers";

export default class FPSMeter extends BaseEntity implements Entity {
  persistent = true;
  sprite: Pixi.Text & GameSprite;

  lastUpdate: number;
  averageDuration: number = 0;
  slowFrameCount: number = 0;

  constructor(position: Vector = [0, 0], color: number = 0x000000) {
    super();
    this.sprite = new Pixi.Text("", {
      fontSize: "12px",
      fill: color,
    });
    this.sprite.position.set(...position);
    this.sprite.layerName = LAYERS.hud;
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

    const fps = (1000 / this.averageDuration).toFixed(0);
    const bodies = this.game!.world.bodies.length;
    this.sprite.text = `fps: ${fps} | bodies: ${bodies}`;
  }
}
