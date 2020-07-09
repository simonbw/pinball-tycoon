import { Text } from "pixi.js";
import { ControllerButton } from "../../core/io/Gamepad";
import * as Keys from "../../core/io/Keys";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { LayerName } from "../../core/graphics/Layers";

/** Pauses and unpauses the game when visibility is lost. */
export default class PauseController extends BaseEntity implements Entity {
  sprite: Text & GameSprite;
  pausable = false;
  persistent = true;

  constructor() {
    super();

    this.sprite = new Text("Paused", {
      dropShadow: true,
      dropShadowAlpha: 0.6,
      dropShadowBlur: 20,
      dropShadowColor: 0xffffff,
      dropShadowDistance: 0,
      fill: 0xffffff,
      fontFamily: ["DS Digital"],
      fontSize: 120,
    });
    this.sprite.layerName = "hud";

    this.sprite.anchor.set(0.5, 0.5);
  }

  onRender() {
    this.sprite.visible = this.game!.paused;
    this.sprite.x = this.game!.renderer.pixiRenderer.width / 4;
    this.sprite.y = this.game!.renderer.pixiRenderer.height / 4;
  }

  onButtonDown(button: number) {
    if (button === ControllerButton.START) {
      this.game!.togglePause();
    }
  }

  onKeyDown(key: Keys.KeyCode) {
    if (key === "KeyP") {
      this.game!.togglePause();
    }
  }
}
