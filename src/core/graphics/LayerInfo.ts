import * as Pixi from "pixi.js";
import { Vector } from "../Vector";

/**
 * Info about a rendering layer
 *
 * TODO: Should we stick z on here?
 */
export class LayerInfo {
  readonly container: Pixi.Container;
  readonly paralax: number;
  readonly anchor: Vector;

  constructor({ paralax, anchor, filters, alpha }: LayerInfoOptions = {}) {
    this.container = new Pixi.Container();
    this.paralax = paralax ?? 1.0;
    this.anchor = anchor ?? [0, 0];
    this.container.filters = filters ?? [];
    this.container.alpha = alpha ?? 1.0;
  }
}

export interface LayerInfoOptions {
  paralax?: number;
  anchor?: Vector;
  filters?: Pixi.Filter[];
  alpha?: number;
}
