import Bezier from "bezier-js";
import BaseEntity from "../../../core/entity/BaseEntity";
import Entity from "../../../core/entity/Entity";
import { V, V2d } from "../../../core/Vector";
import MultiWall from "./MultiWall";
import { Path, Matrix3 } from "three";
import { transformPoint } from "../../tables/SvgTable/svgUtils";

export default class PathWall extends BaseEntity implements Entity {
  constructor(
    path: Path,
    segments: number = 50,
    width: number = 1.0,
    transform?: Matrix3,
    color?: number
  ) {
    super();

    const p2Points: V2d[] = [];

    for (const curve of path.curves) {
    }

    // TODO: Something better that gets all the corners exactly
    for (let point of path.getPoints(segments)) {
      if (transform) {
        p2Points.push(transformPoint(point.x, point.y, transform));
      } else {
        p2Points.push(V(point.x, point.y));
      }
    }

    this.addChild(new MultiWall(p2Points, width, color));
  }
}
