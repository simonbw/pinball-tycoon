import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import Flipper from "../playfield/Flipper";
import { PositionalSound } from "./PositionalSound";
import { clamp } from "../../core/util/MathUtil";

const BUZZ_GAIN = 0.25;

export default class FlipperSoundController extends BaseEntity
  implements Entity {
  private buzzSound: PositionalSound;
  constructor(private flipper: Flipper) {
    super();
    this.buzzSound = this.addChild(
      new PositionalSound("buzz", flipper.getPosition(), {
        continuous: true,
        gain: this.flipper.engaged ? BUZZ_GAIN : 0,
        randomStart: true,
      })
    );
  }

  getGain() {
    return (this.flipper.length / 6) ** 1.5;
  }

  async engage() {
    this.buzzSound.gain = BUZZ_GAIN;
    if (this.flipper.length < 5) {
      await this.wait(0.003);
    }
    this.addChild(
      new PositionalSound("flipperUp", this.flipper.getPosition(), {
        gain: this.getGain(),
      })
    );
  }

  async disengage() {
    this.buzzSound.gain = 0.0;
    this.addChild(
      new PositionalSound("flipperDown", this.flipper.getPosition(), {
        gain: this.getGain(),
      })
    );
    await this.wait();
    this.buzzSound.jumpToRandom();
  }
}
