import * as Pixi from "pixi.js";

// Info about a rendering layer
export class LayerInfo {
  readonly layer: Pixi.Container;
  readonly scroll: number;

  constructor(scroll: number, filters: Pixi.Filter[] = []) {
    this.scroll = scroll;
    this.layer = new Pixi.Container();
    this.layer.filters = filters;
  }
}

// CAUTION: Order matters in this object
export const Layers = {
  world_way_back: new LayerInfo(1),
  world_back: new LayerInfo(1),
  ball: new LayerInfo(1),
  world: new LayerInfo(1),
  world_front: new LayerInfo(1),
  world_overlay: new LayerInfo(1),
  hud: new LayerInfo(0),
  menu: new LayerInfo(0),
};

export type LayerName = keyof typeof Layers;
