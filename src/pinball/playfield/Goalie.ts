import { MeshPhongMaterial } from "three";
import Entity from "../../core/entity/Entity";
import { clamp } from "../../core/util/MathUtil";
import { Vector } from "../../core/Vector";
import DropTarget from "./DropTarget";
import { CustomHandlersMap } from "../../core/entity/GameEventHandler";
import { scoreEvent } from "../LogicBoard";

const MATERIAL = new MeshPhongMaterial({
  color: 0xff0000,
});

const DROP_FORCE = 150;
const RESET_TIME = 5;
const WIDTH = 3.3;
const HEIGHT = 4.5;

export default class Goalie extends DropTarget implements Entity {
  start: Vector;
  end: Vector;
  t: number = 0;
  reverse: boolean = false;
  speed: number = 2.0;

  constructor(start: Vector, end: Vector) {
    super(start, end.sub(start).angle, WIDTH, HEIGHT, DROP_FORCE, RESET_TIME);

    this.start = start.clone();
    this.end = end.clone();

    // TODO: Figure out how to do handlers nicer
    this.handlers["goal"] = () => {
      this.clearTimers();
      this.lower();
    };
    this.handlers["resetDefenders"] = () => {
      this.raise();
    };
  }

  onDrop() {
    this.game!.dispatch(scoreEvent(5300));
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
