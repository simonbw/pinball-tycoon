import Entity from "../../core/entity/Entity";
import TargetLamp from "../playfield/lamps/TargetLamp";
import Objective from "./Objective";

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

  getLamps(): TargetLamp[] {
    return [
      this.game!.entities.byId("spinner-target-lamp")! as TargetLamp,
    ].filter((x) => x);
  }

  onAdd() {
    for (const lamp of this.getLamps()) {
      lamp.flash(Infinity);
    }
  }

  onComplete() {
    for (const lamp of this.getLamps()) {
      lamp.stopFlashing();
      lamp.turnOff();
    }
  }

  toString() {
    return `Spins: ${this.spinsRemaining}`;
  }
}
