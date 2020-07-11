import BaseEntity from "../entity/BaseEntity";
import Entity from "../entity/Entity";
import Game from "../Game";

export default class FPSMeter extends BaseEntity implements Entity {
  persistent = true;
  lastUpdate: number;
  averageDuration: number = 0;
  slowFrameCount: number = 0;

  constructor() {
    super();
    this.lastUpdate = performance.now();
  }

  onAdd(game: Game) {
    this.averageDuration = game.trueRenderTimestep;
  }

  onRender() {
    const now = performance.now();
    const duration = now - this.lastUpdate;
    this.averageDuration = 0.9 * this.averageDuration + 0.1 * duration;
    this.lastUpdate = now;
  }

  getFps(): number {
    return Math.ceil(1000 / this.averageDuration);
  }

  getBodyCount(): number {
    return this.game?.world.bodies.length ?? 0;
  }

  getObjCount() {
    return this.game?.renderer.scene.children.length;
  }

  getText() {
    const fps = this.getFps();
    const bodyCount = this.getBodyCount();
    const objCount = this.getObjCount();
    return `fps: ${fps} | bodies: ${bodyCount} | objects: ${objCount}`;
  }
}
