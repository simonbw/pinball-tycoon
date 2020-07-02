import * as Keys from "./constants/Keys";
import BaseEntity from "./entity/BaseEntity";
import { ControllerButton } from "./constants/Gamepad";
import Entity from "./entity/Entity";

export default class PauseController extends BaseEntity implements Entity {
  pausable = false;
  persistent = true;

  onAdd() {
    document.addEventListener("visibilitychange", this.onVisibilityChange);
  }

  onDestroy() {
    document.removeEventListener("visibilitychange", this.onVisibilityChange);
  }

  onVisibilityChange = () => {
    if (document.hidden) {
      this.pause();
    }
  };

  onButtonDown(button: number) {
    if (button === ControllerButton.START) {
      this.pause();
    }
  }

  onKeyDown(key: number) {
    if (key === Keys.ESCAPE) {
      this.game.togglePause();
    }
  }

  pause() {
    if (!this.game.paused) {
      this.game.pause();
    }
  }
}
