import BaseEntity from "../core/entity/BaseEntity";
import * as Pixi from "pixi.js";
import { LayerName } from "../core/graphics/Layers";
import Entity from "../core/entity/Entity";
import { isLogicBoard } from "./LogicBoard";

interface ScoreEvent {
  type: "score";
  points: number;
}

export default class Scoreboard extends BaseEntity implements Entity {
  layer: LayerName = "hud";
  sprite: Pixi.Text;

  constructor() {
    super();

    this.sprite = new Pixi.Text(``, {
      fill: 0xff3333,
      fontFamily: ["DS Digital"],
      fontSize: 48,
      dropShadow: true,
      dropShadowBlur: 10,
      dropShadowColor: 0xff3333,
      dropShadowAlpha: 0.5,
      dropShadowDistance: 0,
    });
    this.sprite.anchor.set(1, 0);
    this.updateText();
  }

  onRender() {
    this.sprite.x = this.game!.renderer.pixiRenderer.width / 2 - 5;
    this.sprite.y = 5;
    const logicBoard = this.game!.entities.getTagged("logic_board")[0];
    if (isLogicBoard(logicBoard)) {
      const { ballsRemaining, score } = logicBoard;
      const newText = `${"◌".repeat(ballsRemaining)} ${score} pts`;
      this.sprite.text = newText;
    }
  }

  updateText() {}
}
