import Entity from "../../core/entity/Entity";
import { SoundName } from "../../core/resources/sounds";

/** Describes what happens when a ball collides with this */
export interface BallCollisionInfo {
  beginContactSound?: SoundName;
  duringContactSound?: SoundName;
  endContactSound?: SoundName;
  scaleImpact?: (impact: number) => number;
}

export interface WithBallCollisionInfo {
  ballCollisionInfo: BallCollisionInfo;
}

export function hasCollisionInfo(
  thing?: unknown
): thing is WithBallCollisionInfo {
  return Boolean(thing && (thing as any).ballCollisionInfo);
}
