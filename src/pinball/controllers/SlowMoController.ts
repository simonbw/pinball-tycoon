import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";

const KEY_SLOW_MO = 16; // Shift
const SLOW_SPEED = 0.3;
const RAMP_DOWN_SPEED = 0.01;
const RAMP_UP_SPEED = 0.005;

export default class SlowMoController extends BaseEntity implements Entity {
  onTick() {
    const game = this.game!;
    if (game.io.keys[KEY_SLOW_MO]) {
      if (game.slowMo > SLOW_SPEED) {
        game.slowMo = Math.max(game.slowMo - RAMP_DOWN_SPEED, SLOW_SPEED);
      } else {
        game.slowMo = SLOW_SPEED;
      }
    } else {
      if (game.slowMo < 1) {
        game.slowMo = Math.min(game.slowMo + RAMP_UP_SPEED, 1);
      } else {
        game.slowMo = 1;
      }
    }
  }
}
