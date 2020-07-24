import { MeshPhongMaterial } from "three";
import Entity from "../../core/entity/Entity";
import { clamp } from "../../core/util/MathUtil";
import { V2d } from "../../core/Vector";
import { SoundInstance } from "../sound/SoundInstance";
import { scoreEvent } from "../system/LogicBoard";
import { getDefenderUpCount } from "./Defender";
import DropTarget from "./DropTarget";

const MATERIAL = new MeshPhongMaterial({
  color: 0xff0000,
});

const DROP_FORCE = 60;
const RESET_TIME = 15;
const WIDTH = 3.3;
const HEIGHT = 4.5;

export default class Goalie extends DropTarget implements Entity {
  start: V2d;
  end: V2d;
  t: number = 0;
  reverse: boolean = false;
  speed: number = 1.0;

  constructor(start: V2d, end: V2d) {
    super(start, end.sub(start).angle, WIDTH, HEIGHT, DROP_FORCE, RESET_TIME);

    this.start = start.clone();
    this.end = end.clone();

    // TODO: Figure out how to do handlers nicer
    this.handlers["goal"] = () => {
      this.clearTimers();
      this.lower();
      this.speed = this.speed % 5;
      this.speed = this.speed + 1;
    };
    this.handlers["resetDefenders"] = () => {
      this.raise();
    };
  }

  onDrop() {
    const defenderUpCount = getDefenderUpCount(this.game!);
    if (defenderUpCount === 0) {
      this.game!.dispatch(scoreEvent(5300 * (this.speed + 1)));
      this.addChild(new SoundInstance("goalieDown"));
    } else {
      this.game!.dispatch(scoreEvent(3450 * (this.speed + 1)));
      this.addChild(new SoundInstance("goalieDown"));
    }
  }

  onTimeout() {
    this.addChild(new SoundInstance("defenderUp2"));
  }

  getMaterial() {
    return MATERIAL;
  }

  onTick(dt: number) {
    super.onTick.call(this, dt);

    if (this.up) {
      const change = (this.reverse ? -1 : 1) * dt * this.speed;
      this.t = clamp(this.t + change);
      if ((this.t === 1.0 && !this.reverse) || (this.t === 0 && this.reverse)) {
        this.reverse = !this.reverse;
      }
      const [x, y] = this.start.lerp(this.end, this.t);
      this.mesh.position.x = x;
      this.mesh.position.y = y;
      this.body.position[0] = x;
      this.body.position[1] = y;
    }
  }
}
