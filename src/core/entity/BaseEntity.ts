import Game from "../Game";
import p2, { Spring, Constraint } from "p2";
import Entity from "./Entity";
import Pixi from "pixi.js";
import { Vector, V } from "../Vector";
import { LayerName } from "../Layers";

/**
 * Base class for lots of stuff in the game.
 */
export default abstract class BaseEntity implements Entity {
  game: Game | null;
  sprite?: Pixi.DisplayObject;
  body?: p2.Body;
  layer: LayerName;
  pausable: boolean = true;
  persistent: boolean = false;
  springs?: Spring[];
  constraints?: Constraint[];

  children?: Entity[];
  parent?: Entity;

  // Convert local coordinates to world coordinates.
  // Requires either a body or a sprite.
  localToWorld(worldPoint: Vector): Vector {
    if (this.body) {
      const result = V([0, 0]);
      this.body.toWorldFrame(result, worldPoint);
      return result;
    }
    if (this.sprite) {
      const result = this.sprite.toGlobal(
        new Pixi.Point(worldPoint[0], worldPoint[1])
      );
      return V([result.x, result.y]);
    }
    return V([0, 0]);
  }

  getPosition(): Vector {
    if (this.body) {
      return V(this.body.position);
    }
    if (this.sprite) {
      return V([this.sprite.x, this.sprite.y]);
    }
    throw new Error("Position is not implemented for this entity");
  }

  // Removes this from the game. You probably shouldn't override this method.
  destroy() {
    if (this.game) {
      this.game.removeEntity(this);
      for (const child of this.children) {
        child.destroy();
      }
      if (this.parent) {
        // TODO: maybe don't use array splice
        this.parent.children.splice(this.parent.children.indexOf(this));
      }
    }
  }

  addChild(child: Entity): Entity {
    if (child.parent) {
      throw new Error("Child already has a parent.");
    }
    this.children = this.children ?? [];
    this.children.push(child);
    child.parent = this;
    // if we're already added, add the child too
    if (this.game) {
      this.game.addEntity(child);
    }
    return child;
  }
}
