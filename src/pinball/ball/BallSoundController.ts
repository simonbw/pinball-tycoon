import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { SoundName } from "../../core/resources/sounds";
import { clamp } from "../../core/util/MathUtil";
import { V } from "../../core/Vector";
import { PositionalSoundInstance } from "../system/PositionalSoundInstance";
import Ball from "./Ball";

const MAX_SPEED = 100.0;

export default class BallSoundController extends BaseEntity implements Entity {
  rollingSound!: PositionalSoundInstance;
  constructor(public ball: Ball) {
    super();
    this.rollingSound = this.addChild(
      new PositionalSoundInstance("ballRolling", ball.getPosition(), {
        continuous: true,
        gain: 0,
      })
    );
  }

  onTick() {
    const position = this.ball.getPosition();
    this.rollingSound.setPosition(position);
    const v = V(this.ball.body.velocity);
    const speed = v.magnitude / MAX_SPEED; // approximately [0,1]
    this.rollingSound.speed = 0.8 + speed * 2.0;
    this.rollingSound.gain = clamp(speed, 0, 1.2);
  }

  emitSound(soundName: SoundName, gain: number = 1.0) {
    this.addChild(
      new PositionalSoundInstance(soundName, this.ball.getPosition(), { gain })
    );
  }
}
