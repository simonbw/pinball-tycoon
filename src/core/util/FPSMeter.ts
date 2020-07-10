import BaseEntity from "../entity/BaseEntity";
import Entity from "../entity/Entity";
import Game from "../Game";
import { Vector, V } from "../Vector";

export default class FPSMeter extends BaseEntity implements Entity {
  persistent = true;
  lastUpdate: number;
  averageDuration: number = 0;
  slowFrameCount: number = 0;

  constructor(position: Vector = V(0, 0), color: number = 0x000000) {
    super();
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

    const objs = this.game!.renderer.scene.children.length;
    const newText = `fps: ${fps} | bodies: ${bodies} | meshes: ${objs}`;
  }
}
