import Objective from "./Objective";
import Entity from "../../core/entity/Entity";
import { RolloverEvent } from "../playfield/Rollover";

export default class SpinnerObjective extends Objective implements Entity {
  constructor(public spinsRemaining: number = 100) {
    super();
  }

  handlers = {
    spin: () => {
      this.spinsRemaining -= 1;
      if (this.spinsRemaining <= 0) {
        this.complete();
      }
    },
  };

  toString() {
    return `Spins: ${this.spinsRemaining}`;
  }
}
