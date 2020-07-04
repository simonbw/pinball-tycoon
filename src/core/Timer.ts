import BaseEntity from "./entity/BaseEntity";
import Entity from "./entity/Entity";

/** Schedule something to happen after a certain amount of game time */
export default class Timer extends BaseEntity implements Entity {
  timeRemaining: number = 0;
  effect: () => void;

  constructor(delay: number, effect: () => void) {
    super();
    this.timeRemaining = delay;
    this.effect = effect;
  }

  onTick() {
    this.timeRemaining -= this.game!.tickTimestep;
    if (this.timeRemaining <= 0) {
      this.effect();
      this.destroy();
    }
  }
}
