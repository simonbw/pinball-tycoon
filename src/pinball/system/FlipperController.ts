import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { getBinding } from "../ui/KeyboardBindings";
import { KeyCode } from "../../core/io/Keys";
import { ControllerButton } from "../../core/io/Gamepad";
import { TiltEvent } from "./TiltMeter";

export default class FlipperController extends BaseEntity implements Entity {
  enabled: boolean = true;

  handlers = {
    tilt: ({ count }: TiltEvent) => {
      if (count >= 3) {
        this.enabled = false;
        this.game!.dispatch({ type: "leftFlipperDown" });
        this.game!.dispatch({ type: "rightFlipperDown" });
      }
    },

    gameStart: () => {
      this.enabled = true;
    },
  };

  onKeyDown(key: KeyCode) {
    if (this.enabled && !this.game?.paused) {
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
    if (this.enabled) {
      if (button === ControllerButton.RB) {
        this.game!.dispatch({ type: "rightFlipperUp" });
      } else if (button === ControllerButton.LB) {
        this.game!.dispatch({ type: "leftFlipperUp" });
      }
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
