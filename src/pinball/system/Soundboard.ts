import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { SoundName } from "../../core/resources/sounds";
import { SoundInstance } from "./SoundInstance";

/**
 * Plays sounds from the table. Probably unnessessary with the SoundInstance class.
 */
export default class Soundboard extends BaseEntity implements Entity {
  handlers = {
    playSound: ({ type, sound, ...options }: PlaySoundEvent) => {
      this.addChild(new SoundInstance(sound, options));
    },

    stopSound: ({ sound }: StopSoundEvent) => {
      for (const entity of [...this.children]) {
        if (entity instanceof SoundInstance) {
          if (entity.soundName === sound) {
            entity.destroy();
          }
        }
      }
    },
  };
}

interface PlaySoundEvent extends SoundOptions {
  type: "playSound";
  sound: SoundName;
}

export interface SoundOptions {
  pan?: number;
  gain?: number;
  speed?: number;
  continuous?: boolean;
}

export function playSoundEvent(
  sound: SoundName,
  options: SoundOptions = {}
): PlaySoundEvent {
  return {
    type: "playSound",
    sound,
    ...options,
  };
}

interface StopSoundEvent extends SoundOptions {
  type: "stopSound";
  sound: SoundName;
}

export function stopSoundEvent(sound: SoundName): StopSoundEvent {
  return {
    type: "stopSound",
    sound,
  };
}
