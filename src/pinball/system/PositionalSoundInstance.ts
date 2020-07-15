import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import Game from "../../core/Game";
import { SoundName, SOUNDS } from "../../core/resources/sounds";
import { SoundOptions } from "./Soundboard";
import { SoundInstance } from "./SoundInstance";
import { V2d, ArrayLen2 } from "../../core/Vector";
import { clamp } from "../../core/util/MathUtil";

/**
 * Represents a currently playing sound.
 */
export class PositionalSoundInstance extends SoundInstance implements Entity {
  constructor(soundName: SoundName, position: V2d, options: SoundOptions = {}) {
    super(soundName, options);
    this.setPosition(position);
  }

  setPosition([x, y]: [number, number]) {
    this.pan = clamp(x / 40, -0.5, 0.5);
  }
}
