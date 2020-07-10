import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";

const IPS_TO_MPH = 1 / 17.6;

interface ScoreEvent {
  type: "score";
  points: number;
}

export default class Speedometer extends BaseEntity implements Entity {
  score: number = 0;

  constructor() {
    super();
  }

  onRender() {}
}
