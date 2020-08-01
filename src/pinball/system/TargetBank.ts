import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import LightUpTarget from "../playfield/LightUpTarget";
import { SoundInstance } from "../sound/SoundInstance";
import { scoreEvent } from "./LogicBoard";

export default class TargetBank extends BaseEntity implements Entity {
  targets: LightUpTarget[] = [];
  cooldown: boolean = false;

  constructor() {
    super();
  }

  async unlitHit(target: LightUpTarget) {
    if (!this.cooldown) {
      if (this.targets.every((t) => t.lit)) {
        this.game!.dispatch(scoreEvent(15000));
        this.game!.dispatch({ type: "targetBankComplete", targetBank: this });
        this.addChild(new SoundInstance("upgrade"));
        await this.flash(2);
        await this.lightShow(2);
        await this.flash(2);
      } else {
        this.addChild(new SoundInstance("defenderDown2"));
        this.game!.dispatch(scoreEvent(1000));
        target.light();
      }
    }
  }

  setAllEnabled(enabled: boolean = true) {
    for (const target of this.targets) {
      target.enabled = enabled;
    }
  }

  async lightShow(iterations: number = 3, duration: number = 0.1) {
    this.clearTimers();
    this.cooldown = true;
    this.setAllEnabled(false);

    const t = [...this.targets, ...this.targets.slice(1).reverse().slice(1)];
    for (let i = 0; i !== iterations * t.length; i++) {
      const target = t[i % t.length];
      target.light();
      await this.wait(duration);
      target.unLight();
    }

    this.setAllEnabled(true);
    this.cooldown = false;
  }

  async flash(iterations: number = 3, duration: number = 0.1) {
    this.clearTimers();
    this.cooldown = true;
    this.setAllEnabled(false);

    for (let i = 0; i < iterations; i++) {
      await this.wait(duration);
      for (const target of [...this.targets].reverse()) {
        target.light();
      }
      await this.wait(duration);
      for (const target of [...this.targets].reverse()) {
        target.unLight();
      }
    }

    this.setAllEnabled(true);
    this.cooldown = false;
  }

  addTarget(target: LightUpTarget) {
    this.addChild(target);
    this.targets.push(target);
    target.onUnlitHit = () => this.unlitHit(target);
    target.onLitHit = () => this.unlitHit(target);
  }

  handlers = {
    gameStart: async () => {
      await this.lightShow(4);
      await this.flash(1);
    },

    newBall: async () => {
      await this.flash(1);
      await this.lightShow(1, 0.06);
      await this.flash(1);
    },
  };
}
