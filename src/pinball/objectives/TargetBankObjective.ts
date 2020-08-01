import Objective from "./Objective";
import Entity from "../../core/entity/Entity";
import TargetLamp from "../playfield/lamps/TargetLamp";

export default class TargetBankObjective extends Objective implements Entity {
  constructor(public banksToComplete: number = 1) {
    super();
  }

  handlers = {
    targetBankComplete: () => {
      this.banksToComplete -= 1;
      if (this.banksToComplete <= 0) {
        this.complete();
      }
    },
  };

  getLamps(): TargetLamp[] {
    // TODO: Only light up the ones that still need to be hit/lit
    return [
      this.game!.entities.byId("target-bank-target-lamp-1")! as TargetLamp,
      this.game!.entities.byId("target-bank-target-lamp-2")! as TargetLamp,
      this.game!.entities.byId("target-bank-target-lamp-3")! as TargetLamp,
      this.game!.entities.byId("target-bank-target-lamp-4")! as TargetLamp,
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
    return `Hit Targets ${this.banksToComplete}`;
  }
}
