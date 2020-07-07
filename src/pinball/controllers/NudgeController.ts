import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { Vector, V } from "../../core/Vector";
import { KeyCode } from "../../core/io/Keys";

const NUDGE_RIGHT_KEY: KeyCode = "Slash";
const NUDGE_LEFT_KEY: KeyCode = "KeyZ";
const NUDGE_UP_LEFT_KEY: KeyCode = "KeyC";
const NUDGE_UP_RIGHT_KEY: KeyCode = "Comma";

type NudgeDirection = "left" | "right" | "up";

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
      case NUDGE_LEFT_KEY:
        this.game!.dispatch(nudgeEvent(V([-power, 0])));
        break;
      case NUDGE_RIGHT_KEY:
        this.game!.dispatch(nudgeEvent(V([power, 0])));
        break;
      case NUDGE_UP_LEFT_KEY:
        this.game!.dispatch(nudgeEvent(V([-power, power])));
        break;
      case NUDGE_UP_RIGHT_KEY:
        this.game!.dispatch(nudgeEvent(V([power, power])));
        break;
    }
  }
}
