import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { ControllerButton } from "../../core/io/Gamepad";
import * as Keys from "../../core/io/Keys";
import { getBinding } from "../ui/KeyboardBindings";

/** Pauses and unpauses the game when visibility is lost. */
export default class PauseController extends BaseEntity implements Entity {
  pausable = false;
  persistent = true;

  constructor() {
    super();
  }

  onRender() {}

  onButtonDown(button: number) {
    if (button === ControllerButton.START) {
      this.game!.togglePause();
    }
  }

  onKeyDown(key: Keys.KeyCode) {
    if (key === getBinding("PAUSE")) {
      this.game!.togglePause();
    }
  }
}
