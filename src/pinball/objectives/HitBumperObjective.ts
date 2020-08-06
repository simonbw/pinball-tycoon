import Objective from "./Objective";
import Entity from "../../core/entity/Entity";
import TargetLamp from "../playfield/lamps/TargetLamp";

export default class HitBumperObjective extends Objective implements Entity {
  constructor(public hitsRemaining: number = 10) {
    super();
  }

  handlers = {
    bumperHit: () => {
      this.hitsRemaining -= 1;
      if (this.hitsRemaining <= 0) {
        this.complete();
      }
    },
  };

  getLamps(): TargetLamp[] {
    return [
      this.game!.entities.byId("bumper-target-lamp-1")! as TargetLamp,
      this.game!.entities.byId("bumper-target-lamp-2")! as TargetLamp,
      this.game!.entities.byId("top-bumper-target-lamp")! as TargetLamp,
      this.game!.entities.byId("pass-bumper-target-lamp")! as TargetLamp,
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
    return `Bumper Hits: ${this.hitsRemaining}`;
  }
}
