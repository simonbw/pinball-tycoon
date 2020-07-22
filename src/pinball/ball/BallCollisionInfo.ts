import { SoundName } from "../../core/resources/sounds";
import { SoundOptions } from "../sound/SoundInstance";
import { choose } from "../../core/util/Random";

/** Describes what happens when a ball collides with this */
export interface BallCollisionInfo {
  beginContactSound?: SoundInfo;
  duringContactSound?: SoundInfo;
  endContactSound?: SoundInfo;
  scaleImpact?: (impact: number) => number;
}

export type SoundInfo = (
  | {
      name: SoundName;
    }
  | {
      names: SoundName[];
    }
) & {
  speedVariance?: number;
};

export function getNameFromSoundInfo(info: SoundInfo): SoundName {
  if ("name" in info) {
    return info.name;
  } else {
    return choose(info.names);
  }
}
export interface WithBallCollisionInfo {
  ballCollisionInfo: BallCollisionInfo;
}

export function hasCollisionInfo(
  thing?: unknown
): thing is WithBallCollisionInfo {
  return Boolean(thing && (thing as any).ballCollisionInfo);
}
