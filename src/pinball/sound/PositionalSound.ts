import Entity from "../../core/entity/Entity";
import Game from "../../core/Game";
import { SoundName } from "../../core/resources/sounds";
import { V, V2d } from "../../core/Vector";
import { SoundInstance, SoundOptions } from "./SoundInstance";

const LISTENER: V2d = V(0, 120);
const SCALE_Y = 0.5;
const FALL_OFF = 0.025;
const SPREAD = 0.7;

/**
 * Represents a currently playing sound.
 */
export class PositionalSound extends SoundInstance implements Entity {
  private _distanceGain: number = 1.0;
  private distanceGainNode!: GainNode;

  set distanceGain(value: number) {
    if (!this.game) {
      this._distanceGain = value;
    } else {
      this.distanceGainNode.gain.value = value;
    }
  }

  constructor(soundName: SoundName, position: V2d, options: SoundOptions = {}) {
    super(soundName, options);
    this.setPosition(position);
  }

  makeChain(game: Game) {
    const mainGain = super.makeChain.call(this, game);
    this.distanceGainNode = game.audio.createGain();
    this.distanceGainNode.gain.value = this._distanceGain;
    mainGain.connect(this.distanceGainNode);
    return this.distanceGainNode;
  }

  setPosition(position: V2d) {
    const relativePosition = position.sub(LISTENER);
    relativePosition.y *= SCALE_Y;
    const theta = relativePosition.angle;
    this.pan = Math.cos(theta) * SPREAD;
    const gain = 1.0 / (1.0 + relativePosition.magnitude * FALL_OFF);
    this.distanceGain = gain;
  }
}
