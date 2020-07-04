import * as Pixi from "pixi.js";
import BaseEntity from "../entity/BaseEntity";
import { Vector } from "../Vector";
import { LayerName } from "../Layers";
import Entity from "../entity/Entity";
import Game from "../Game";

// Class used to make drawing primitives easy
export default class Drawing extends BaseEntity implements Entity {
  persistent = true;
  pausable = false;

  sprites: Map<LayerName, Pixi.Graphics> = new Map();

  line(
    [x1, y1]: Vector,
    [x2, y2]: Vector,
    width = 0.01,
    color = 0xffffff,
    alpha = 1.0,
    layer: LayerName = "world"
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
    layer: LayerName = "world"
  ) {
    const sprite = this.getLayerSprite(layer);
    sprite.lineStyle();
    sprite.beginFill(color, alpha);
    sprite.drawPolygon([one[0], one[1], two[0], two[1], three[0], three[1]]);
    sprite.endFill();
  }

  getLayerSprite(layerName: LayerName): Pixi.Graphics {
    if (!this.sprites.has(layerName)) {
      const sprite = new Pixi.Graphics();
      this.sprites.set(layerName, sprite);
      this.game!.renderer.add(sprite, layerName);
    }
    return this.sprites.get(layerName)!;
  }

  beforeTick() {
    for (const sprite of this.sprites.values()) {
      sprite.clear();
    }
  }

  onDestroy(game: Game) {
    for (const [layerName, sprite] of this.sprites.entries()) {
      game.renderer.remove(sprite, layerName);
    }
  }
}
