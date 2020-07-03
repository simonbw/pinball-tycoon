import Bezier from "bezier-js";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { V } from "../../core/Vector";
import MultiWall from "./MultiWall";

export default class CurveWall extends BaseEntity implements Entity {
  constructor(
    curve: Bezier,
    segments: number = 20,
    width: number = 1.0,
    color: number = 0x0000ff
  ) {
    super();

    const points = curve.getLUT(segments).map((point) => V([point.x, point.y]));
    console.log("curve points:", points);

    this.children = [new MultiWall(points, width, color)];
  }
}
