import Objective from "./Objective";
import Entity from "../../core/entity/Entity";
import { RolloverEvent } from "../playfield/Rollover";
import TargetLamp from "../playfield/lamps/TargetLamp";

export default class PassLoopObjective extends Objective implements Entity {
  constructor(public rolloversRemaining: number = 5) {
    super();
  }

  handlers = {
    rollover: ({ rollover }: RolloverEvent) => {
      if (rollover.id === "pass-loop-rollover") {
        this.rolloversRemaining -= 1;
        if (this.rolloversRemaining <= 0) {
          this.complete();
        }
      }
    },
  };

  getLamps(): TargetLamp[] {
    return [this.game!.entities.byId("pass-loop-target-lamp")! as TargetLamp];
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
    return `Passes: ${this.rolloversRemaining}`;
  }
}
