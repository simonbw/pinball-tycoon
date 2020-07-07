import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { KeyCode } from "../../core/io/Keys";
import { Graphics } from "pixi.js";
import { LayerName } from "../../core/graphics/Layers";

const KEYS_SLOW_MO: KeyCode[] = ["ShiftLeft", "ShiftRight"];
const SLOW_SPEED = 0.3;
const RAMP_DOWN_SPEED = 0.01;
const RAMP_UP_SPEED = 0.005;

export default class SlowMoController extends BaseEntity implements Entity {
  layer: LayerName = "hud";
  remaining: number = 1.0;
  sprite = new Graphics();

  onTick(dt: number) {
    const game = this.game!;
    if (KEYS_SLOW_MO.some((key) => game.io.keyIsDown(key))) {
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

  // onRender() {
  //   this.sprite.clear();
  //   this.sprite.beginFill(0x777777);
  //   this.sprite.drawRect(0, 0, 100, 10);
  //   this.sprite.endFill();
  //   this.sprite.beginFill(0xff4444);
  //   this.sprite.drawRect(0, 0, 100 * this.remaining, 10);
  //   this.sprite.endFill();
  //   this.sprite.x = 10;
  //   this.sprite.y = this.game!.renderer.pixiRenderer.height - 20;
  // }
}
