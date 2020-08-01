import Objective from "./Objective";
import Entity from "../../core/entity/Entity";
import Rollover, { RolloverEvent } from "../playfield/Rollover";
import TargetLamp from "../playfield/lamps/TargetLamp";

export default class InlanesObjective extends Objective implements Entity {
  leftDone: boolean = false;
  rightDone: boolean = false;

  constructor() {
    super();
  }

  handlers = {
    rollover: ({ rollover, skipFlash }: RolloverEvent) => {
      if (
        rollover.id === "left-inlane-rollover" ||
        rollover.id === "right-inlane-rollover"
      ) {
        skipFlash();
        rollover.lamp.stopFlashing();
        rollover.lamp.turnOn();

        const [leftTargetLamp, rightTargetLamp] = this.getLamps();
        if (rollover.id === "left-inlane-rollover") {
          this.leftDone = true;
          leftTargetLamp.stopFlashing();
          leftTargetLamp.turnOff();
        } else {
          this.rightDone = true;
          rightTargetLamp.stopFlashing();
          rightTargetLamp.turnOff();
        }

        if (this.leftDone && this.rightDone) {
          this.complete();
        }
      }
    },
  };

  getRollovers() {
    return [
      this.game!.entities.byId("left-inlane-rollover")! as Rollover,
      this.game!.entities.byId("right-inlane-rollover")! as Rollover,
    ];
  }

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
    for (const rollover of this.getRollovers()) {
      rollover.lamp.stopFlashing();
      rollover.lamp.turnOff();
    }
  }

  toString() {
    if (!this.leftDone && !this.rightDone) {
      return `Defend Flanks`;
    } else if (!this.leftDone) {
      return `Defend Left Flank`;
    } else if (!this.rightDone) {
      return `Defend Right Flank`;
    } else {
      return `Goal Defended`;
    }
  }
}
