import { Vector3 } from "three";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import Game from "../../core/Game";
import { degToRad } from "../../core/util/MathUtil";
import { V2d, V } from "../../core/Vector";
import CameraController from "../controllers/CameraController";
import MagicBallController from "../controllers/MagicBallController";
import NudgeController from "../controllers/NudgeController";
import SlowMoController from "../controllers/SlowMoController";
import LogicBoard from "../system/LogicBoard";
import { Rect } from "../util/Rect";

export default class Table extends BaseEntity implements Entity {
  readonly center: Vector3;
  readonly coinSlotPos: V2d;

  constructor(
    public readonly bounds: Rect,
    public readonly incline: number = degToRad(4),
    public readonly ballDropPosition: V2d
  ) {
    super();

    this.center = new Vector3(bounds.center.x, bounds.center.y, 0);
    this.coinSlotPos = V((bounds.center.x + bounds.right) / 2, bounds.bottom);

    // Controllers
    this.addChildren(
      new CameraController(this),
      new LogicBoard(this),
      new MagicBallController(),
      new NudgeController(),
      new SlowMoController()
    );
  }

  onAdd(game: Game) {
    game.dispatch({ type: "envUpdated" });
  }
}

interface EnvUpdatedEvent {
  type: "envUpdated";
}
