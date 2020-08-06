import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import Rollover from "../playfield/Rollover";
import { SoundInstance } from "../sound/SoundInstance";
import { scoreEvent } from "./LogicBoard";

export default class ToggleGroup extends BaseEntity implements Entity {
  rollovers: Rollover[] = [];
  lit: boolean[] = [];

  constructor() {
    super();
  }

  addRollover(rollover: Rollover) {
    this.addChild(rollover);
    this.rollovers.push(rollover);
    this.lit.push(false);
    const i = this.rollovers.length - 1;
    rollover.onRollover = () => this.onRollover(i);
    rollover.lamp.toggleTime = 0.04;
  }

  async onRollover(i: number) {
    const rollover = this.rollovers[i];
    rollover.cooldown = true;
    this.lit[i] = !this.lit[i];

    if (this.lit.every((x) => x)) {
      this.addChild(new SoundInstance("upgrade"));
      await this.updateLamps();
      this.rollovers.forEach((r) => (r.cooldown = true));
      this.game!.dispatch(scoreEvent(1000));
      await this.flash();
      await this.clear();
      await this.updateLamps();
      this.rollovers.forEach((r) => (r.cooldown = false));
    } else {
      this.addChild(new SoundInstance("defenderDown1"));
      this.game!.dispatch(scoreEvent(500));
      await this.updateLamps();
      rollover.cooldown = false;
    }
  }

  flash() {
    return Promise.all(
      this.rollovers.map((rollover, i) => rollover.lamp.flash(5, 0.08, 0.08))
    );
  }

  updateLamps() {
    return Promise.all(
      this.rollovers.map((rollover, i) => rollover.lamp.setLit(this.lit[i]))
    );
  }

  clear() {
    for (let i = 0; i < this.lit.length; i++) {
      this.lit[i] = false;
    }
    return this.updateLamps();
  }

  permuteForward() {
    for (let i = 0; i < this.lit.length; i++) {
      const j = (i + 1) % this.lit.length;
      if (this.lit[i] && !this.lit[j]) {
        swap(this.lit, i, j);
        break;
      }
    }
  }

  permuteBackward() {
    for (let i = 0; i < this.lit.length; i++) {
      const j = (i + 1) % this.lit.length;
      if (!this.lit[i] && this.lit[j]) {
        swap(this.lit, i, j);
        break;
      }
    }
  }

  handlers = {
    gameStart: async () => {},

    newBall: async () => {},

    leftFlipperUp: () => {
      this.permuteBackward();
      this.updateLamps();
    },

    rightFlipperUp: () => {
      this.permuteForward();
      this.updateLamps();
    },
  };
}

function swap(a: unknown[], i: number, j: number): void {
  const temp = a[i];
  a[i] = a[j];
  a[j] = temp;
}
