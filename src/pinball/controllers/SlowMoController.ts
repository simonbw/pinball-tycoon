import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { getBindings } from "../ui/KeyboardBindings";
import { setFocusAmount } from "../postprocessing";

const SLOW_SPEED = 0.4;
const RAMP_DOWN_SPEED = 0.01;
const RAMP_UP_SPEED = 0.005;
const COOLDOWN_POINT = 0.8;

// const DRAIN_SPEED = 0.5;
const DRAIN_SPEED = 0.5;
const FILL_SPEED = 0.2;

export default class SlowMoController extends BaseEntity implements Entity {
  remaining: number = 0.0;
  cooldown: boolean = true;

  constructor() {
    super();
  }

  onTick(dt: number) {
    const game = this.game!;
    const keys = getBindings("SLO_MO", "SLO_MO2");
    const keyDown = game.io.anyKeyIsDown(keys);

    setFocusAmount(1.0 - game.slowMo);

    if (keyDown && this.remaining > 0 && !this.cooldown) {
      const cost = (dt * DRAIN_SPEED) / game.slowMo ** 2;
      if (this.remaining > cost) {
        this.remaining -= cost;
      } else {
        this.remaining = 0;
        this.cooldown = true;
      }
      game.slowMo = Math.max(game.slowMo - RAMP_DOWN_SPEED, SLOW_SPEED);
    } else {
      this.remaining = Math.min(this.remaining + FILL_SPEED * dt, 1.0);
      if (this.cooldown && this.remaining >= COOLDOWN_POINT) {
        this.cooldown = false;
      }
      game.slowMo = Math.min(game.slowMo + RAMP_UP_SPEED, 1);
    }
  }
}
