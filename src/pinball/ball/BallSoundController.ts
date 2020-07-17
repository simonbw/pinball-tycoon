import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { SoundName } from "../../core/resources/sounds";
import { clamp } from "../../core/util/MathUtil";
import { V } from "../../core/Vector";
import { PositionalSound } from "../system/PositionalSound";
import Ball from "./Ball";
import { rNormal } from "../../core/util/Random";

const MAX_SPEED = 100.0;

export default class BallSoundController extends BaseEntity implements Entity {
  rollingSound!: PositionalSound;
  constructor(public ball: Ball) {
    super();
    this.rollingSound = this.addChild(
      new PositionalSound("ballRolling", ball.getPosition(), {
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
    this.rollingSound.speed = 0.6 + speed * 2.3;
    this.rollingSound.gain = clamp(speed, 0, 1.2);
  }

  emitSound(soundName: SoundName, gain: number = 1.0) {
    const position = this.ball.getPosition();
    const speed = rNormal(1.0, 0.8);
    this.addChild(new PositionalSound(soundName, position, { gain, speed }));
  }
}
