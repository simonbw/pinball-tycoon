import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { UpdateScoreEvent } from "../LogicBoard";
import { PlaneGeometry, MeshStandardMaterial, Mesh } from "three";

interface ScoreEvent {
  type: "score";
  points: number;
}

const MATERIAL = new MeshStandardMaterial({
  color: 0x222222,
});

export default class Scoreboard extends BaseEntity implements Entity {
  constructor(left: number, right: number, height: number) {
    super();
    const width = right - left;
    const x = (left + right) / 2;
    const geometry = new PlaneGeometry(width, height);
    geometry.rotateX(-Math.PI / 2);
    geometry.translate(x, 0, -height / 2);
    this.mesh = new Mesh(geometry, MATERIAL);
  }

  handlers = {
    updateScore: ({ points }: UpdateScoreEvent) => {
      this.updateText();
    },
  };

  onRender() {}

  updateText() {}
}
