import * as Pixi from "pixi.js";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { LayerName } from "../../core/graphics/Layers";

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
  layer: LayerName = "hud";

  constructor() {
    super();
    const container = new Pixi.Container();
    this.sprite = container;
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
      text.x = 20;
      text.y = 20 + 24 * i;
      text.anchor.set(0, 0);
      container.addChild(text);
    }
    this.sprite.x = 20;
    this.sprite.y = 20;
  }
}
