import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { soundIsLoaded } from "../../core/resources/sounds";
import { clamp } from "../../core/util/MathUtil";
import Flipper from "../playfield/Flipper";
import { PositionalSound } from "./PositionalSound";

const BUZZ_GAIN = 0.23;

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
    return clamp(this.flipper.length / 6.5) ** 3;
  }

  async engage() {
    this.buzzSound.gain = BUZZ_GAIN;
    this.addChild(
      new PositionalSound("flipperUp4", this.flipper.getPosition(), {
        gain: this.getGain(),
      })
    );
  }

  async disengage() {
    this.buzzSound.gain = 0.0;
    this.addChild(
      new PositionalSound("flipperDown3", this.flipper.getPosition(), {
        gain: this.getGain(),
      })
    );
    await this.wait();
    this.buzzSound.jumpToRandom();
  }
}
