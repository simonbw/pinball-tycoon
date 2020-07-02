import * as Pixi from "pixi.js";
import Game from "../Game";
import p2 from "p2";
import PhysicsHandler from "./PhysicsHandler";
import GameEventHandler from "./GameEventHandler";
import IOEventHandler from "./IOEventHandler";
import { LayerName } from "../Layers";

export interface WithOwner {
  owner?: Entity;
}

/**
 * A thing that responds to game events.
 */
export default interface Entity
  extends GameEventHandler,
    PhysicsHandler,
    IOEventHandler {
  // The game this entity belongs to. This should only be set by the Game.
  game: Game | null;

  // Children that get added/destroyed along with this entity
  readonly children?: Entity[];

  // Entity that has this entity as a child
  parent?: Entity;

  // Tags to find entities by
  readonly tags?: ReadonlyArray<string>;

  // If true, this entity doesn't get cleaned up when the scene is cleared
  readonly persistent: boolean;

  // True if this entity will stop updating when the game is paused.
  readonly pausable: boolean;

  // The object that gets added to
  readonly sprite?: Pixi.DisplayObject & WithOwner;

  // Layer to draw the sprite on
  readonly layer: LayerName;

  // Physics body that gets automatically added/removed from the world
  readonly body?: p2.Body & WithOwner;

  // Physics springs that gets automatically added/removed from the world
  readonly springs?: p2.Spring[];

  // Physics constraints that gets automatically added/removed from the world
  readonly constraints?: p2.Constraint[];

  // Called to remove this entity from the game
  destroy(): void;
}
