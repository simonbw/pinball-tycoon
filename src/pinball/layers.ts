import GameRenderer from "../core/graphics/GameRenderer";
import { LayerInfo } from "../core/graphics/LayerInfo";
import Game from "../core/Game";
import { TABLE_CENTER } from "./Table";
import { Vector } from "../core/Vector";

const anchor = TABLE_CENTER.add([0, -20]);

const layers = {
  floor: new LayerInfo(),
  // Draw the thing behind everything else
  table_base: new LayerInfo({ paralax: 0.95, anchor }),
  // The ones to actually use
  mainfield_bottom: new LayerInfo({ paralax: 0.95, anchor }),
  mainfield_middle: new LayerInfo({ paralax: 1.0, anchor }),
  mainfield_top: new LayerInfo({ paralax: 1.05, anchor }),
  // Upper
  upperfield_bottom: new LayerInfo({ paralax: 1.1, anchor }),
  upperfield_middle: new LayerInfo({ paralax: 1.1, anchor }),
  upperfield_top: new LayerInfo(),
  // Screen space
  hud: new LayerInfo({ paralax: 0 }),
  menu: new LayerInfo({ paralax: 0 }),
};

export type LayerName = keyof typeof layers;

export function initializeLayers(game: Game) {
  for (const [name, layerInfo] of Object.entries(layers)) {
    game.renderer.createLayer(name, layerInfo);
  }
  game.renderer.defaultLayer = LAYERS.mainfield_middle;
  game.camera.paralaxScale = 0.035;
}

export function updateHeadPosition(headPosition: Vector) {
  anchor.set(headPosition);
}

export const LAYERS = {} as Record<LayerName, LayerName>;
for (const property in layers) {
  const layerName = property as LayerName;
  LAYERS[layerName] = layerName;
}
