import { MeshPhongMaterial } from "three";
import Entity from "../../core/entity/Entity";
import { clamp } from "../../core/util/MathUtil";
import { Vector } from "../../core/Vector";
import DropTarget from "./DropTarget";
import { scoreEvent } from "../LogicBoard";
import { playSoundEvent } from "../Soundboard";

const MATERIAL = new MeshPhongMaterial({
  color: 0xffbb00,
});

const DROP_FORCE = 20;
const RESET_TIME = 15;
const WIDTH = 2.2;
const HEIGHT = 3.3;

export default class Defender extends DropTarget implements Entity {
  tags = ["defender"];

  constructor(position: Vector, angle: number = 0.0) {
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

    if (upCount === 0) {
      this.game?.dispatch(scoreEvent(10850));
      this.game?.dispatch(playSoundEvent("defendersDown"));
    } else {
      this.game!.dispatch(scoreEvent(1850));
      this.game?.dispatch(playSoundEvent("defenderDown"));
    }
  }
}

function isDefender(e?: Entity): e is Defender {
  return e instanceof Defender;
}
