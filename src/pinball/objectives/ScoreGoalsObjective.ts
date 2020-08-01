import Objective from "./Objective";
import Entity from "../../core/entity/Entity";
import TargetLamp from "../playfield/lamps/TargetLamp";

export default class ScoreGoalsObjective extends Objective implements Entity {
  constructor(public goalsRemaining: number = 3) {
    super();
  }

  handlers = {
    goal: () => {
      this.goalsRemaining -= 1;
      if (this.goalsRemaining <= 0) {
        this.complete();
      }
    },
  };

  getLamps(): TargetLamp[] {
    return [this.game!.entities.byId("goal-target-lamp")! as TargetLamp];
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
    return `Score Goals: ${this.goalsRemaining}`;
  }
}
