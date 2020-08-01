import * as Three from "three";
import Game from "../Game";
import EntityPhysics from "./EntityPhysics";
import GameEventHandler from "./GameEventHandler";
import IOEventHandler from "./IOEventHandler";

export interface WithOwner {
  owner?: Entity;
}

export interface Disposable {
  dispose: () => void;
}

/**
 * A thing that responds to game events.
 */
export default interface Entity
  extends GameEventHandler,
    EntityPhysics,
    IOEventHandler {
  /** The game this entity belongs to. This should only be set by the Game. */
  game: Game | null;

  id?: string;

  /** Children that get added/destroyed along with this entity */
  readonly children?: Entity[];

  /** Entity that has this entity as a child */
  parent?: Entity;

  /** Tags to find entities by */
  readonly tags?: ReadonlyArray<string>;

  /** If true, this entity doesn't get cleaned up when the scene is cleared */
  readonly persistent: boolean;

  /** True if this entity will stop updating when the game is paused. */
  readonly pausable: boolean;

  /** The Three.js object that gets added/removed from the scene automatically */
  readonly mesh?: Three.Mesh & WithOwner;

  /** The Three.js objects that gets added/removed from the scene automatically */
  readonly object3ds?: readonly (Three.Object3D & WithOwner)[];

  /** Things that should be disposed of when this entity is destroyed */
  readonly disposeables?: ReadonlyArray<Disposable>;

  /** Called to remove this entity from the game */
  destroy(): void;
}
