import Bezier from "bezier-js";
import BaseEntity from "../../../core/entity/BaseEntity";
import Entity from "../../../core/entity/Entity";
import { V, V2d } from "../../../core/Vector";
import MultiWall from "./MultiWall";
import { Path, Matrix3, Shape } from "three";
import { transformPoint } from "../../tables/SvgTable/svgUtils";

const SEGMENTS_PER_HALF_INCH = 0.8;

export default class BlobWall extends BaseEntity implements Entity {
  constructor(
    path: Shape,
    width: number = 1.0,
    transform?: Matrix3,
    color?: number
  ) {
    super();

    const p2Points: V2d[] = [];

    for (const curve of path.curves) {
      const segments =
        Math.ceil(curve.getLength() * SEGMENTS_PER_HALF_INCH) + 1;
      for (let point of curve.getPoints(segments)) {
        const p = transform
          ? transformPoint(point.x, point.y, transform)
          : V(point.x, point.y);
        if (!p.equals(p2Points[p2Points.length - 1])) {
          p2Points.push(p);
        }
      }
    }

    this.addChild(new MultiWall(p2Points, width, color));
  }
}
