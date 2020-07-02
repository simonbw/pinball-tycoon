import BaseEntity from "../../core/entity/BaseEntity";
import { Graphics } from "pixi.js";
import { Body, Capsule } from "p2";
import { Vector } from "../../core/Vector";
import { Materials } from "../Materials";
import { CollisionGroups } from "./Collision";
import Wall from "./Wall";
import Entity from "../../core/entity/Entity";

export default class MultiWall extends BaseEntity implements Entity {
  constructor(
    points: readonly Vector[],
    width: number = 1.0,
    color: number = 0x0000ff
  ) {
    super();
    if (points.length < 2) {
      throw new Error("Need at least 2 points for a multiwall.");
    }

    for (let i = 1; i < points.length; i++) {
      const start = points[i - 1];
      const end = points[i];
      this.addChild(new Wall(start, end, width, color));
    }
  }
}
