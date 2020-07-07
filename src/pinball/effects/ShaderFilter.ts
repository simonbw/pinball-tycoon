import { Filter } from "pixi.js";

export function makeShaderFilter(shaderCode: string): Filter {
  const filter = new Filter(undefined, shaderCode);
  filter.resolution = window.devicePixelRatio || 1;
  return filter;
}
