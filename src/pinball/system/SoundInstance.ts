import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import Game from "../../core/Game";
import { SoundName, SOUNDS } from "../../core/resources/sounds";
import { SoundOptions } from "./Soundboard";

/**
 * Represents a currently playing sound.
 */
export class SoundInstance extends BaseEntity implements Entity {
  public speed: number;
  public readonly continuous: boolean;

  private sourceNode!: AudioBufferSourceNode;
  private panNode!: StereoPannerNode;
  private gainNode!: GainNode;

  private elapsed: number = 0;
  private lastTick: number = 0;

  private paused: boolean = false;

  set pan(value: number) {
    if (!this.game) {
      this.options.pan = value;
    } else {
      this.panNode.pan.value = value;
    }
  }

  get pan(): number {
    if (!this.game) {
      return this.options.pan ?? 0;
    } else {
      return this.panNode.pan.value;
    }
  }

  set gain(value: number) {
    if (!this.game) {
      this.options.gain = value;
    } else {
      this.gainNode.gain.value = value;
    }
  }

  get gain(): number {
    if (!this.game) {
      return this.options.gain ?? 1;
    } else {
      return this.gainNode.gain.value;
    }
  }

  constructor(
    public readonly soundName: SoundName,
    private options: SoundOptions = {}
  ) {
    super();
    this.speed = options.speed ?? 1.0;
    this.continuous = options.continuous ?? false;
  }

  onAdd(game: Game) {
    this.makeChain(game).connect(game.masterGain);

    this.sourceNode.onended = () => {
      if (!this.paused) {
        this.destroy();
      }
    };

    this.lastTick = game.audio.currentTime;

    this.sourceNode.start();
  }

  makeChain({ audio, slowMo, masterGain }: Game): AudioNode {
    this.sourceNode = audio.createBufferSource();
    this.sourceNode.buffer = SOUNDS.get(this.soundName)!;
    this.sourceNode.playbackRate.value = this.speed * slowMo;
    this.sourceNode.loop = this.continuous;

    this.panNode = audio.createStereoPanner();
    this.panNode.pan.value = this.options.pan ?? 0.0;

    this.gainNode = audio.createGain();
    this.gainNode.gain.value = this.options.gain ?? 1.0;

    this.sourceNode.connect(this.panNode);
    this.panNode.connect(this.gainNode);
    return this.gainNode;
  }

  onTick() {
    const now = this.game!.audio.currentTime;
    this.elapsed += (now - this.lastTick) * this.sourceNode.playbackRate.value;
    this.lastTick = now;
    this.sourceNode.playbackRate.value = this.speed * this.game!.slowMo;
  }

  pause() {
    this.paused = true;
    this.sourceNode.stop();
  }

  unpause() {
    this.paused = false;
    const bufferDuration = this.sourceNode.buffer!.duration;
    if (!this.continuous && this.elapsed >= bufferDuration) {
      this.destroy();
      return;
    }

    const newNode = this.game!.audio.createBufferSource();
    newNode.buffer = this.sourceNode.buffer;
    this.sourceNode = newNode;
    this.sourceNode.connect(this.panNode);
    const startTime = this.elapsed % bufferDuration;
    this.sourceNode.start(undefined, startTime);
  }

  onPause() {
    this.pause();
  }

  onUnpause() {
    this.unpause();
  }

  onDestroy() {
    this.sourceNode.stop();
  }
}
