import Entity from "../../../core/entity/Entity";
import { V2d } from "../../../core/Vector";
import Lamp, { LampOptions } from "./Lamp";
import { rBool } from "../../../core/util/Random";

export default class TargetLamp extends Lamp implements Entity {
  constructor(position: V2d, public id: string, options: LampOptions = {}) {
    super(position, options);
  }

  handlers = {
    gameStart: async () => {
      await this.wait(Math.random() * 0.13 * 2);
      await this.flash(5);
    },

    newBall: async () => {
      this.clearTimers();
      if (Math.random() < 0.3) {
        this.flash(Infinity);
      } else {
        this.turnOff();
      }
    },
  };
}
