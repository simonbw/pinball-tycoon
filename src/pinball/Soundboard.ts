import BaseEntity from "../core/entity/BaseEntity";
import Entity from "../core/entity/Entity";
import { SoundName, SOUNDS } from "../core/resources/sounds";
import Game from "../core/Game";
import SoundChain from "./util/SoundChain";

/**
 * Plays sounds from the table.
 */
export default class Soundboard extends BaseEntity implements Entity {
  output!: AudioNode;
  nowPlaying = new Set<AudioBufferSourceNode>();

  onAdd(game: Game) {
    this.output = game.audio.createGain();
    this.output.connect(game.masterGain);
  }

  onPause() {
    for (const source of this.nowPlaying) {
      source.stop();
    }
  }

  onUnpause() {
    for (const source of this.nowPlaying) {
      source.start();
    }
  }

  onTick() {
    for (const source of this.nowPlaying) {
      source.playbackRate.value = this.game!.slowMo;
    }
  }

  handlers = {
    playSound: (e: PlaySoundEvent) => {
      const audio = this.game!.audio;
      const chain = new SoundChain();

      const sourceNode = audio.createBufferSource();
      sourceNode.buffer = SOUNDS.get(e.sound)!;
      chain.addNode(sourceNode);

      if (e.pan !== undefined) {
        const panNode = audio.createStereoPanner();
        panNode.pan.value = e.pan;
        chain.addNode(panNode);
      }

      if (e.gain !== undefined) {
        const gainNode = audio.createGain();
        gainNode.gain.value = e.gain;
        chain.addNode(gainNode);
      }

      chain.addNode(this.output);

      sourceNode.start();

      // Keep track of what's playing
      this.nowPlaying.add(sourceNode);
      sourceNode.onended = () => {
        this.nowPlaying.delete(sourceNode);
      };
    },
  };
}

interface PlaySoundEvent extends SoundOptions {
  type: "playSound";
  sound: SoundName;
}

interface SoundOptions {
  pan?: number;
  gain?: number;
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
