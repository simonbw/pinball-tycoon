import p2, { Constraint, Spring } from "p2";
import * as Three from "three";
import Game from "../Game";
import { Vector, V } from "../Vector";
import Entity from "./Entity";

/**
 * Base class for lots of stuff in the game.
 */
export default abstract class BaseEntity implements Entity {
  game: Game | null = null;
  mesh?: Three.Mesh;
  object3ds?: Three.Object3D[];
  body?: p2.Body;
  bodies?: p2.Body[];
  pausable: boolean = true;
  persistent: boolean = false;
  springs?: Spring[];
  constraints?: Constraint[];

  children?: Entity[];
  parent?: Entity;

  // Convert local coordinates to world coordinates.
  // Requires a body
  localToWorld(worldPoint: [number, number]): Vector {
    if (this.body) {
      const result: Vector = V(0, 0);
      this.body.toWorldFrame(result, worldPoint);
      return result;
    }
    return V(0, 0);
  }

  getPosition(): Vector {
    if (this.body) {
      return V(this.body.position);
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

  addChild<T extends Entity>(child: T): T {
    if (child.parent) {
      throw new Error("Child already has a parent.");
    }
    child.parent = this;
    this.children = this.children ?? [];
    this.children.push(child);
    // if we're already added, add the child too
    if (this.game) {
      this.game.addEntity(child);
    }
    return child;
  }

  addChildren(...children: Entity[]): void {
    for (const child of children) {
      this.addChild(child);
    }
  }

  wait(delay: number, onTick?: (dt: number) => void): Promise<void> {
    return new Promise((resolve) => {
      const timer = new Timer(delay, () => resolve(), onTick);
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
// TODO: This doesn't need to extend BaseEntity. That way we could have it in
// a different file, and it might be a little lighter weight
class Timer extends BaseEntity implements Entity {
  timeRemaining: number = 0;
  endEffect?: () => void;
  duringEffect?: (dt: number) => void;

  constructor(
    delay: number,
    endEffect?: () => void,
    duringEffect?: (dt: number) => void
  ) {
    super();
    this.timeRemaining = delay;
    this.endEffect = endEffect;
    this.duringEffect = duringEffect;
  }

  onTick(dt: number) {
    this.timeRemaining -= dt;
    this.duringEffect?.(dt);
    if (this.timeRemaining <= 0) {
      this.endEffect?.();
      this.destroy();
    }
  }
}
