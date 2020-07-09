import p2, { Constraint, Spring } from "p2";
import Pixi, { TilingSprite } from "pixi.js";
import Game from "../Game";
import { Vector } from "../Vector";
import Entity from "./Entity";

/**
 * Base class for lots of stuff in the game.
 */
export default abstract class BaseEntity implements Entity {
  game: Game | null = null;
  sprite?: Pixi.DisplayObject;
  body?: p2.Body;
  pausable: boolean = true;
  persistent: boolean = false;
  springs?: Spring[];
  constraints?: Constraint[];

  children?: Entity[];
  parent?: Entity;

  // Convert local coordinates to world coordinates.
  // Requires either a body or a sprite.
  localToWorld(worldPoint: [number, number]): Vector {
    if (this.body) {
      const result: Vector = [0, 0];
      this.body.toWorldFrame(result, worldPoint);
      return result;
    }
    if (this.sprite) {
      const result = this.sprite.toGlobal(
        new Pixi.Point(worldPoint[0], worldPoint[1])
      );
      return [result.x, result.y];
    }
    return [0, 0];
  }

  getPosition(): Vector {
    if (this.body) {
      return this.body.position;
    }
    if (this.sprite) {
      return [this.sprite.x, this.sprite.y];
    }
    throw new Error("Position is not implemented for this entity");
  }

  // Removes this from the game. You probably shouldn't override this method.
  destroy() {
    if (this.game) {
      this.game.removeEntity(this);
      while (this.children?.length) {
        this.children[this.children.length - 1].destroy();
      }
      if (this.parent) {
        const pChildren = this.parent.children!;
        const index = pChildren.lastIndexOf(this);
        if (index < 0) {
          throw new Error(`Parent doesn't have child`);
        }
        pChildren.splice(index, 1);
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

  wait(delay: number): Promise<void> {
    return new Promise((resolve) => {
      const timer = new Timer(delay, () => resolve());
      try {
        this.addChild(timer);
      } catch (e) {
        console.warn(e);
      }
    });
  }

  clearTimers(): void {
    if (this.children) {
      const timers = this.children.filter((e) => e instanceof Timer);
      for (const timer of timers) {
        timer.destroy();
      }
    }
  }
}

// TODO: Implement this some other way?
class Timer extends BaseEntity implements Entity {
  timeRemaining: number = 0;
  effect: () => void;

  constructor(delay: number, effect: () => void) {
    super();
    this.timeRemaining = delay;
    this.effect = effect;
  }

  onTick(dt: number) {
    this.timeRemaining -= dt;
    if (this.timeRemaining <= 0) {
      this.effect();
      this.destroy();
    }
  }
}
