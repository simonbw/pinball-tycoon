import { Graphics } from "pixi.js";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { LAYERS } from "../layers";
import { getBindings } from "../ui/KeyboardBindings";

const SLOW_SPEED = 0.3;
const RAMP_DOWN_SPEED = 0.01;
const RAMP_UP_SPEED = 0.005;
const COOLDOWN_POINT = 0.8;

const WIDTH = 100;
const HEIGHT = 20;
const DRAIN_SPEED = 0.5;
const FILL_SPEED = 0.2;

export default class SlowMoController extends BaseEntity implements Entity {
  remaining: number = 0.0;
  cooldown: boolean = true;
  sprite: Graphics & GameSprite;

  constructor() {
    super();
    this.sprite = new Graphics();
    this.sprite.layerName = LAYERS.hud;
  }

  onTick(dt: number) {
    const game = this.game!;
    const keys = getBindings("SLO_MO", "SLO_MO2");
    const keyDown = game.io.anyKeyIsDown(keys);

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

  onRender() {
    this.sprite.clear();
    this.sprite.beginFill(0x777777);
    this.sprite.drawRect(0, 0, WIDTH, HEIGHT);
    this.sprite.endFill();
    this.sprite.beginFill(this.cooldown ? 0xff4444 : 0xffff00);
    this.sprite.drawRect(0, 0, WIDTH * this.remaining, HEIGHT);
    this.sprite.endFill();
    this.sprite.x = this.game!.renderer.getWidth() - 110;
    if (this.cooldown) {
      this.sprite.lineStyle(2.0, 0xffffff, 0.5);
      this.sprite.moveTo(WIDTH * COOLDOWN_POINT, 0);
      this.sprite.lineTo(WIDTH * COOLDOWN_POINT, HEIGHT);
    }
    this.sprite.y = 80;
  }
}
