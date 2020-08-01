import Objective from "./Objective";
import Entity from "../../core/entity/Entity";
import { RolloverEvent } from "../playfield/Rollover";
import TargetLamp from "../playfield/lamps/TargetLamp";

export default class InlanesObjective extends Objective implements Entity {
  constructor(public inlaneRolloversRemaining: number = 3) {
    super();
  }

  handlers = {
    rollover: ({ id }: RolloverEvent) => {
      if (id === "left-inlane-rollover" || id === "right-inlane-rollover") {
        this.inlaneRolloversRemaining -= 1;
        if (this.inlaneRolloversRemaining <= 0) {
          this.complete();
        }
      }
    },
  };

  getLamps(): TargetLamp[] {
    return [
      this.game!.entities.byId("inlane-target-lamp-1")! as TargetLamp,
      this.game!.entities.byId("inlane-target-lamp-2")! as TargetLamp,
    ];
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
    return `Blocks: ${this.inlaneRolloversRemaining}`;
  }
}
