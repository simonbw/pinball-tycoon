import * as Pixi from "pixi.js";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { LAYERS } from "../layers";

interface ScoreEvent {
  type: "score";
  points: number;
}

const LINES = [
  "CONTROLS",
  "— — — — — — —",
  "New Game: S",
  "Left Flipper: X",
  "Right Flipper: >",
  "Plunger: Enter",
  "Pause: P",
  "Nudge →: z",
  "Nudge ↗: c",
  "Nudge ↖: ,",
  "Nudge ←: /",
  "Slowmo: SHIFT",
];

export default class ControlDisplay extends BaseEntity implements Entity {
  score: number = 0;
  sprite: Pixi.Container & GameSprite = new Pixi.Container();

  constructor() {
    super();
    for (let i = 0; i < LINES.length; i++) {
      const color = 0xff3333;
      const text = new Pixi.Text(LINES[i], {
        fill: color,
        fontFamily: ["DS Digital"],
        fontSize: 20,
        dropShadow: true,
        dropShadowBlur: 10,
        dropShadowColor: color,
        dropShadowAlpha: 0.1,
        dropShadowDistance: 0,
      });
      text.x = 0;
      text.y = 24 * i;
      text.anchor.set(0, 0);
      this.sprite.addChild(text);
    }
    this.sprite.layerName = LAYERS.hud;
    this.sprite.x = 5;
    this.sprite.y = 5;
  }
}
