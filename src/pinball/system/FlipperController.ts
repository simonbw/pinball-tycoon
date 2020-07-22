import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { getBinding } from "../ui/KeyboardBindings";
import { KeyCode } from "../../core/io/Keys";
import { ControllerButton } from "../../core/io/Gamepad";

export default class FlipperController extends BaseEntity implements Entity {
  constructor() {
    super();
  }

  onKeyDown(key: KeyCode) {
    if (!this.game?.paused) {
      switch (key) {
        case getBinding("LEFT_FLIPPER"):
          this.game!.dispatch({ type: "leftFlipperUp" });
          break;
        case getBinding("RIGHT_FLIPPER"):
          this.game!.dispatch({ type: "rightFlipperUp" });
          break;
      }
    }
  }

  onKeyUp(key: KeyCode) {
    if (!this.game?.paused) {
      switch (key) {
        case getBinding("LEFT_FLIPPER"):
          this.game!.dispatch({ type: "leftFlipperDown" });
          break;
        case getBinding("RIGHT_FLIPPER"):
          this.game!.dispatch({ type: "rightFlipperDown" });
          break;
      }
    }
  }

  onButtonDown(button: ControllerButton) {
    if (button === ControllerButton.RB) {
      this.game!.dispatch({ type: "rightFlipperUp" });
    } else if (button === ControllerButton.LB) {
      this.game!.dispatch({ type: "leftFlipperUp" });
    }
  }

  onButtonUp(button: ControllerButton) {
    if (button === ControllerButton.RB) {
      this.game!.dispatch({ type: "rightFlipperDown" });
    } else if (button === ControllerButton.LB) {
      this.game!.dispatch({ type: "leftFlipperDown" });
    }
  }
}
