import Bezier from "bezier-js";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import MultiWall from "./MultiWall";
import { Vector } from "../../core/Vector";

export default class CurveWall extends BaseEntity implements Entity {
  constructor(
    curve: Bezier,
    segments: number = 20,
    width?: number,
    color?: number
  ) {
    super();

    const points: Vector[] = curve
      .getLUT(segments)
      .map((point) => [point.x, point.y]);
    this.addChild(new MultiWall(points, width, color));
  }
}
