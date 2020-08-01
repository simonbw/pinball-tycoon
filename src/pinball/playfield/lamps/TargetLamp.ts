import Entity from "../../../core/entity/Entity";
import { V2d } from "../../../core/Vector";
import Lamp, { LampOptions } from "./Lamp";

export default class TargetLamp extends Lamp implements Entity {
  constructor(position: V2d, public id: string, options: LampOptions = {}) {
    super(position, { intensity: 0.8, ...options });
  }

  handlers = {
    gameStart: async () => {
      await this.wait(Math.random() * 0.13 * 2);
      await this.flash(5);
      await this.turnOff();
    },

    newBall: async () => {
      this.clearTimers();
      this.turnOff();
    },
  };
}
