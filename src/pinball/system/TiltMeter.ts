import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { V2d, V } from "../../core/Vector";
import { SoundInstance } from "../sound/SoundInstance";
import { NudgeEvent } from "../controllers/NudgeController";

export interface TiltEvent {
  type: "tilt";
  count: number;
}

const GRAVITY = -1.0;
const FRICTION = 0.5;
export default class TiltMeter extends BaseEntity implements Entity {
  position: V2d = V(0, 0);
  velocity: V2d = V(0, 0);
  limits: V2d = V(100, 100);

  tiltCount: number = 0;

  constructor() {
    super();
  }

  onTick(dt: number) {
    this.velocity.iadd(this.position.mul(GRAVITY * dt));
    this.velocity.imul(1.0 - FRICTION * dt);

    this.position.iadd(this.velocity.mul(dt));

    const [x, y] = this.position;
    const [lx, ly] = this.limits;
    if (Math.abs(x) > lx || Math.abs(y) > ly) {
      this.tilt();
    }
  }

  tilt() {
    this.tiltCount += 1;
    this.velocity.set([0, 0]);
    this.position.imul(0.5);
    if (this.tiltCount === 1) {
      this.addChild(new SoundInstance("tilt1"));
    } else if (this.tiltCount === 2) {
      this.addChild(new SoundInstance("tilt2"));
    } else {
      this.addChild(new SoundInstance("tilt3"));
    }
    this.game!.dispatch({ type: "tilt", count: this.tiltCount });
  }

  handlers = {
    nudge: ({ impulse }: NudgeEvent) => {
      this.velocity.iadd(impulse);
    },

    gameStart: () => {
      this.tiltCount = 0;
    },
  };
}
