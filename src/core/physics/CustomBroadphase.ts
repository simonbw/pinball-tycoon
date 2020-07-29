import { Body, SAPBroadphase, World, AABB, Broadphase } from "p2";
import Ball from "../../pinball/ball/Ball";
import { WithOwner } from "../entity/Entity";
import Grid from "../util/Grid";

const CUSTOM_BROADPHASE_TYPE = 3;
const HUGE_LIMIT = 500;
const HUGE: [number, number][] = [];

export default class CustomBroadphase extends SAPBroadphase {
  dynamicBodies: Set<Body> = new Set();
  kinematicBodies: Set<Body> = new Set();
  hugeBodies: Set<Body> = new Set();
  spatialHash = new Grid<Set<Body>>(); // TODO: This could be faster with a single array

  cellSize = 4;

  constructor() {
    super(CUSTOM_BROADPHASE_TYPE);
  }

  setWorld(world: World) {
    super.setWorld.call(this, world);

    world.on("addBody", ({ body }: { body: Body }) => this.onAddBody(body));
    world.on("removeBody", ({ body }: { body: Body }) =>
      this.onRemoveBody(body)
    );
  }

  onAddBody(body: Body) {
    if (body.type === Body.DYNAMIC) {
      this.dynamicBodies.add(body);
    } else if (body.type === Body.KINEMATIC) {
      this.kinematicBodies.add(body);
    } else {
      this.addBodyToHash(body);
    }
  }

  onRemoveBody(body: Body) {
    if (body.type === Body.DYNAMIC) {
      this.dynamicBodies.delete(body);
    } else if (body.type === Body.KINEMATIC) {
      this.kinematicBodies.delete(body);
    } else {
      this.removeBodyFromHash(body);
    }
  }

  addBodyToHash(body: Body) {
    const cells = this.aabbToCells(body.getAABB());
    if (cells === HUGE) {
      console.log("huge body added");
      this.hugeBodies.add(body);
    } else {
      for (const cell of cells) {
        this.getCell(cell).add(body);
      }
    }
  }

  removeBodyFromHash(body: Body) {
    const cells = this.aabbToCells(body.getAABB());
    if (cells === HUGE) {
      this.hugeBodies.delete(body);
    } else {
      for (const cell of cells) {
        this.getCell(cell).delete(body);
      }
    }
  }

  /** Returns an array where every 2 entries represents a collision pair */
  getCollisionPairs(world: World): Body[] {
    const result: Body[] = [];

    for (const kBody of this.kinematicBodies) {
      this.addBodyToHash(kBody);
    }

    for (const dBody of this.dynamicBodies) {
      this.addBodyToHash(dBody);
    }

    for (const dBody of this.dynamicBodies) {
      this.removeBodyFromHash(dBody); // This will make sure we don't overlap ourselves, and that we don't double count anything

      for (const other of this.aabbQuery(world, dBody.getAABB())) {
        if (Broadphase.canCollide(dBody, other)) {
          result.push(dBody, other);
        }
      }

      for (const hugeBody of this.hugeBodies) {
        if (hugeBody.getAABB().overlaps(dBody.getAABB())) {
          result.push(dBody, hugeBody);
        }
      }
    }

    for (const kBody of this.kinematicBodies) {
      this.removeBodyFromHash(kBody);
    }

    return result;
  }

  getCell(cell: [number, number]): Set<Body> {
    if (!this.spatialHash.has(cell)) {
      this.spatialHash.set(cell, new Set());
    }
    return this.spatialHash.get(cell)!;
  }

  /** Returns the cells that overlap the aabb. Returns HUGE if the aabb is "huge". */
  aabbToCells(aabb: AABB): [number, number][] {
    const result: [number, number][] = [];

    const lowX = Math.floor(aabb.lowerBound[0] / this.cellSize);
    const lowY = Math.floor(aabb.lowerBound[1] / this.cellSize);
    const highX = Math.ceil(aabb.upperBound[0] / this.cellSize);
    const highY = Math.ceil(aabb.upperBound[1] / this.cellSize);

    // Check for huge
    if (
      !isFinite(lowX) ||
      !isFinite(lowY) ||
      !isFinite(highX) ||
      !isFinite(highY) ||
      Math.abs(highX - lowX) * Math.abs(highY - lowY) > HUGE_LIMIT
    ) {
      return HUGE;
    }

    for (let x = lowX; x < highX; x++) {
      for (let y = lowY; y < highY; y++) {
        result.push([x, y]);
      }
    }

    return result;
  }

  aabbQuery(_: World, aabb: AABB, result?: Body[]): Body[] {
    result = result ?? [];

    const cells = this.aabbToCells(aabb);

    for (const cell of cells) {
      for (const body of this.getCell(cell)) {
        if (body.getAABB().overlaps(aabb) && result.indexOf(body) < 0) {
          result.push(body);
        }
      }
    }

    return result;
  }
}
