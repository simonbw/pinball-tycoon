import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";

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

  constructor() {
    super();
  }
}
