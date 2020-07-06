import { Matrix, Point } from "pixi.js";
import BaseEntity from "../entity/BaseEntity";
import GameRenderer from "./GameRenderer";
import { Vector, V } from "../Vector";
import { LayerInfo } from "./Layers";
import { lerp, lerpOrSnap } from "../util/MathUtil";
import Entity from "../entity/Entity";

//  Controls the viewport.
export default class Camera extends BaseEntity implements Entity {
  persistent = true;

  renderer: GameRenderer;
  position: Vector;
  z: number;
  angle: number;
  velocity: Vector;

  constructor(
    renderer: GameRenderer,
    position: Vector = V([0, 0]),
    z = 25.0,
    angle = 0
  ) {
    super();
    this.renderer = renderer;
    this.position = position;
    this.z = z;
    this.angle = angle;
    this.velocity = V([0, 0]);
  }

  get x() {
    return this.position[0];
  }

  set x(value) {
    this.position[0] = value;
  }

  get y() {
    return this.position[1];
  }

  set y(value) {
    this.position[1] = value;
  }

  get vx() {
    return this.velocity[0];
  }

  set vx(value) {
    this.velocity[0] = value;
  }

  get vy() {
    return this.velocity[1];
  }

  set vy(value) {
    this.velocity[1] = value;
  }

  onTick(dt: number) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }

  // Center the camera on a position
  center([x, y]: Vector) {
    this.x = x;
    this.y = y;
  }

  // Move the camera toward being centered on a position, with a target velocity
  // TODO: Should this be called onRender or onTick?
  smoothCenter(
    [x, y]: Vector,
    [vx, vy]: Vector = V([0, 0]),
    smooth: number = 0.9
  ) {
    const dx = (x - this.x) * this.game!.framerate;
    const dy = (y - this.y) * this.game!.framerate;
    this.smoothSetVelocity(V([vx + dx, vy + dy]), smooth);
  }

  smoothSetVelocity([vx, vy]: Vector, smooth: number = 0.9) {
    this.vx = lerpOrSnap(this.vx, vx, smooth);
    this.vy = lerpOrSnap(this.vy, vy, smooth);
  }

  // Move the camera part of the way to the desired zoom.
  smoothZoom(z: number, smooth: number = 0.9) {
    this.z = smooth * this.z + (1 - smooth) * z;
  }

  // Returns [width, height] of the viewport
  getViewportSize(): Vector {
    return V([
      this.renderer.pixiRenderer.width / this.renderer.pixiRenderer.resolution,
      this.renderer.pixiRenderer.height / this.renderer.pixiRenderer.resolution,
    ]);
  }

  // Convert screen coordinates to world coordinates
  toWorld([x, y]: Vector, depth: number = 1.0): Vector {
    let p = new Point(x, y);
    p = this.getMatrix(depth).applyInverse(p, p);
    return V([p.x, p.y]);
  }

  // Convert world coordinates to screen coordinates
  toScreen([x, y]: Vector, depth = 1.0): Vector {
    let p = new Point(x, y);
    p = this.getMatrix(depth).apply(p, p);
    return V([p.x, p.y]);
  }

  // Creates a transformation matrix to go from screen world space to screen space.
  getMatrix(depth: number = 1.0): Matrix {
    const [w, h] = this.getViewportSize();
    const m = new Matrix();
    m.translate(-this.x * depth, -this.y * depth);
    m.scale(this.z * depth, this.z * depth);
    m.rotate(this.angle);
    m.translate(w / 2, h / 2);
    return m;
  }

  // Update the properties of a renderer layer to match this camera
  updateLayer(layerInfo: LayerInfo) {
    if (layerInfo.scroll !== 0) {
      // TODO: Actually scroll by different amounts
      const layer = layerInfo.layer;
      [layer.x, layer.y] = this.toScreen(V([0, 0]));
      layer.rotation = this.angle;
      layer.scale.set(this.z, this.z);
    }
  }
}
