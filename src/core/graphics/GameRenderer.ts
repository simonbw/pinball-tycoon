import * as Pixi from "pixi.js";
import Camera from "./Camera";
import { LayerName, LayerInfo, Layers } from "./Layers";

// The thing that renders stuff to the screen. Mostly for handling layers.
export default class GameRenderer {
  private layerInfos: Map<LayerName, LayerInfo> = new Map();
  private cursor: string = "none";

  pixiRenderer: Pixi.Renderer;
  stage: Pixi.Container;
  camera: Camera;

  constructor() {
    Pixi.settings.RESOLUTION = window.devicePixelRatio || 1;
    Pixi.utils.skipHello();
    this.pixiRenderer = new Pixi.Renderer({
      width: window.innerWidth,
      height: window.innerHeight,
      antialias: true,
      autoDensity: true,
      resolution: Pixi.settings.RESOLUTION,
    });
    document.body.appendChild(this.pixiRenderer.view);
    this.hideCursor();

    this.stage = new Pixi.Container();
    this.camera = new Camera(this);

    window.addEventListener("resize", () => this.handleResize());

    for (const [layerName, layerInfo] of Object.entries(Layers)) {
      this.stage.addChildAt(layerInfo.layer, this.layerInfos.size);
      this.layerInfos.set(layerName as LayerName, layerInfo);
    }
  }

  private getLayerInfo(layerName: LayerName) {
    const layerInfo = this.layerInfos.get(layerName);
    if (!layerInfo) {
      throw new Error(`Cannot find layer: ${layerInfo}`);
    }
    return layerInfo;
  }

  handleResize() {
    this.pixiRenderer.resize(window.innerWidth, window.innerHeight);
  }

  hideCursor() {
    this.cursor = "none";
  }

  showCursor() {
    this.cursor = "auto";
  }

  // Render the current frame.
  render() {
    for (const layerInfo of this.layerInfos.values()) {
      this.camera.updateLayer(layerInfo);
    }
    this.pixiRenderer.render(this.stage);
    this.pixiRenderer.view.style.cursor = this.cursor;
  }

  add(
    sprite: Pixi.DisplayObject,
    layerName: LayerName = "world"
  ): Pixi.DisplayObject {
    this.getLayerInfo(layerName).layer.addChild(sprite);
    return sprite;
  }

  // Remove a child from a specific layer.
  remove(sprite: Pixi.DisplayObject, layerName: LayerName = "world"): void {
    this.getLayerInfo(layerName).layer.removeChild(sprite);
  }

  addFilter(filter: Pixi.Filter, layerName: LayerName): void {
    const layer = this.getLayerInfo(layerName).layer;
    layer.filters = [...layer.filters!, filter];
  }
}
