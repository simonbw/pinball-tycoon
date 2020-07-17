import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { KeyCode } from "../../core/io/Keys";
import { V2d, V } from "../../core/Vector";
import { getBinding } from "../ui/KeyboardBindings";
import { playSoundEvent } from "../system/Soundboard";
import { clamp } from "../../core/util/MathUtil";
import { SoundInstance } from "../system/SoundInstance";
import { rNormal, rUniform } from "../../core/util/Random";

export interface NudgeEvent {
  type: "nudge";
  impulse: V2d;
  duration: number;
}

function nudgeEvent(impulse: V2d, duration: number = 0.06): NudgeEvent {
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
      // case getBinding("NUDGE_LEFT"):
      //   this.game!.dispatch(nudgeEvent(V(-power, 0)));
      //   break;
      // case getBinding("NUDGE_RIGHT"):
      //   this.game!.dispatch(nudgeEvent(V(power, 0)));
      //   break;
      case getBinding("NUDGE_UP_LEFT"):
        this.nudge(V(-power, power));
        break;
      case getBinding("NUDGE_UP_RIGHT"):
        this.nudge(V(power, power));
        break;
    }
  }

  nudge(impulse: V2d, duration?: number) {
    this.game!.dispatch(nudgeEvent(impulse, duration));
    const pan = clamp(0.02 * impulse.x, -0.3, 0.3);
    this.addChild(
      new SoundInstance("nudge1", { pan, speed: rUniform(0.95, 1.05) })
    );
  }
}
