import { MeshPhongMaterial } from "three";
import Entity from "../../core/entity/Entity";
import { V2d } from "../../core/Vector";
import { scoreEvent } from "../system/LogicBoard";
import { playSoundEvent } from "../system/Soundboard";
import DropTarget from "./DropTarget";
import Game from "../../core/Game";

const MATERIAL = new MeshPhongMaterial({
  color: 0xffbb00,
});

const DROP_FORCE = 20;
const RESET_TIME = 20;
const WIDTH = 2.2;
const HEIGHT = 3.3;

export default class Defender extends DropTarget implements Entity {
  tags = ["defender"];

  constructor(position: V2d, angle: number = 0.0) {
    super(position, angle, WIDTH, HEIGHT, DROP_FORCE, RESET_TIME);

    // TODO: Figure out how to do handlers nicer
    this.handlers["goal"] = () => {
      this.clearTimers();
      this.lower();
    };
    this.handlers["resetDefenders"] = () => {
      this.raise();
    };
  }

  getMaterial() {
    return MATERIAL;
  }

  onDrop() {
    const upCount = this.game!.entities.getTagged("defender")
      .filter(isDefender)
      .filter((defender) => defender.up).length;

    switch (upCount) {
      case 0:
        this.game!.dispatch(scoreEvent(10850));
        this.game?.dispatch(playSoundEvent("defenderDown3"));
        break;
      case 1:
        this.game!.dispatch(scoreEvent(3850));
        this.game?.dispatch(playSoundEvent("defenderDown2"));
        break;
      case 2:
      default:
        this.game!.dispatch(scoreEvent(1850));
        this.game?.dispatch(playSoundEvent("defenderDown1"));
        break;
    }
  }

  onTimeout() {
    this.game?.dispatch(playSoundEvent("defenderUp1"));
  }
}

function isDefender(e?: Entity): e is Defender {
  return e instanceof Defender;
}

export function getDefenderUpCount(game: Game) {
  return game.entities
    .getTagged("defender")
    .filter(isDefender)
    .filter((defender) => defender.up).length;
}
