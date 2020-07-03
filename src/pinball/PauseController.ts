import { Text } from "pixi.js";
import { ControllerButton } from "../core/constants/Gamepad";
import * as Keys from "../core/constants/Keys";
import BaseEntity from "../core/entity/BaseEntity";
import Entity from "../core/entity/Entity";
import { LayerName } from "../core/Layers";

/** Pauses and unpauses the game when visibility is lost. */
export default class PauseController extends BaseEntity implements Entity {
  layer: LayerName = "hud";
  pausable = false;
  persistent = true;

  constructor() {
    super();

    const text = new Text("Paused", {
      dropShadow: true,
      dropShadowAlpha: 0.6,
      dropShadowBlur: 20,
      dropShadowColor: 0xffffff,
      dropShadowDistance: 0,
      fill: 0xffffff,
      fontFamily: ["DS Digital"],
      fontSize: 120,
      anchor: [0.5, 0.5],
    });
    text.anchor.set(0.5, 0.5);
    this.sprite = text;
  }

  onRender() {
    this.sprite.visible = this.game.paused;
    this.sprite.x = this.game.renderer.pixiRenderer.width / 4;
    this.sprite.y = this.game.renderer.pixiRenderer.height / 4;
  }

  onButtonDown(button: number) {
    if (button === ControllerButton.START) {
      this.game.togglePause();
    }
  }

  onKeyDown(key: number) {
    if (key === Keys.P) {
      this.game.togglePause();
    }
  }
}
