import BaseEntity from "../core/entity/BaseEntity";
import Entity from "../core/entity/Entity";
import { Vector, V } from "../core/Vector";

const NUDGE_RIGHT_KEY = 191; // /
const NUDGE_LEFT_KEY = 90; // z
const NUDGE_UP_LEFT_KEY = 67; // c
const NUDGE_UP_RIGHT_KEY = 188; // ,

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

  async onKeyDown(key: number) {
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
