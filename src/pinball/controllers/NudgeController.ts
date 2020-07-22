import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { KeyCode } from "../../core/io/Keys";
import { clamp } from "../../core/util/MathUtil";
import { rUniform } from "../../core/util/Random";
import { V, V2d } from "../../core/Vector";
import { SoundInstance } from "../sound/SoundInstance";
import { getBinding } from "../ui/KeyboardBindings";
import { ControllerButton, ControllerAxis } from "../../core/io/Gamepad";

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

  onKeyDown(key: KeyCode) {
    const power = 40;
    switch (key) {
      case getBinding("NUDGE_UP_LEFT"):
        this.nudge(V(-power, power));
        break;
      case getBinding("NUDGE_UP_RIGHT"):
        this.nudge(V(power, power));
        break;
    }
  }

  onButtonDown(button: ControllerButton) {
    if (button === ControllerButton.B) {
      const x = this.game!.io.getAxis(ControllerAxis.LEFT_X);
      const y = this.game!.io.getAxis(ControllerAxis.LEFT_Y);
      const impulse = V(x, y).imul(50);
      this.nudge(impulse);
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
