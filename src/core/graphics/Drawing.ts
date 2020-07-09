import * as Pixi from "pixi.js";
import BaseEntity from "../entity/BaseEntity";
import Entity, { GameSprite } from "../entity/Entity";
import Game from "../Game";
import { Vector } from "../Vector";

/** Class used to make drawing primitives easy. I mostly use this for debugging stuff. */
export default class Drawing extends BaseEntity implements Entity {
  persistent = true;
  pausable = false;

  private spriteMap: Map<string, Pixi.Graphics & GameSprite> = new Map();

  private get defaultLayer() {
    return this.game?.renderer.defaultLayer ?? "_default";
  }

  line(
    [x1, y1]: Vector,
    [x2, y2]: Vector,
    width = 0.01,
    color = 0xffffff,
    alpha = 1.0,
    layer: string = this.defaultLayer
  ) {
    const sprite = this.getLayerSprite(layer);
    sprite.lineStyle(width, color, alpha);
    sprite.moveTo(x1, y1);
    sprite.lineTo(x2, y2);
  }

  triangle(
    one: Vector,
    two: Vector,
    three: Vector,
    color = 0xff0000,
    alpha = 1.0,
    layer: string = this.defaultLayer
  ) {
    const sprite = this.getLayerSprite(layer);
    sprite.lineStyle();
    sprite.beginFill(color, alpha);
    sprite.drawPolygon([one[0], one[1], two[0], two[1], three[0], three[1]]);
    sprite.endFill();
  }

  getLayerSprite(layerName: string): Pixi.Graphics {
    if (!this.spriteMap.has(layerName)) {
      const sprite = new Pixi.Graphics();
      (sprite as GameSprite).layerName = layerName;
      this.spriteMap.set(layerName, sprite);
      this.game!.renderer.addSprite(sprite);
    }
    return this.spriteMap.get(layerName)!;
  }

  beforeTick() {
    for (const sprite of this.spriteMap.values()) {
      sprite.clear();
    }
  }

  onDestroy(game: Game) {
    for (const sprite of this.spriteMap.values()) {
      game.renderer.remove(sprite);
    }
  }
}
