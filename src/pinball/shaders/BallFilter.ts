import shaderCode from "./BallShader.frag";
import * as Pixi from "pixi.js";

export function makeBallShader() {
  const filter = new Pixi.Filter(undefined, shaderCode);
  filter.resolution = window.devicePixelRatio || 1;
  return filter;
}
