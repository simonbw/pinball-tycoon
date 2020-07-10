import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { KeyCode } from "../../core/io/Keys";
import { Vector, V } from "../../core/Vector";
import { getBinding } from "../ui/KeyboardBindings";

export interface NudgeEvent {
  type: "nudge";
  impulse: Vector;
  duration: number;
}

function nudgeEvent(impulse: Vector, duration: number = 0.05): NudgeEvent {
  return {
    type: "nudge",
    impulse,
    duration,
  };
}

export default class NudgeController extends BaseEntity implements Entity {
  constructor() {
    super();
  }

  async onKeyDown(key: KeyCode) {
    const power = 40;
    switch (key) {
      case getBinding("NUDGE_LEFT"):
        this.game!.dispatch(nudgeEvent(V(-power, 0)));
        break;
      case getBinding("NUDGE_RIGHT"):
        this.game!.dispatch(nudgeEvent(V(power, 0)));
        break;
      case getBinding("NUDGE_UP_LEFT"):
        this.game!.dispatch(nudgeEvent(V(-power, power)));
        break;
      case getBinding("NUDGE_UP_RIGHT"):
        this.game!.dispatch(nudgeEvent(V(power, power)));
        break;
    }
  }
}
