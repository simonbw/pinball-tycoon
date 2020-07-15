import Bezier from "bezier-js";
import { ExtrudeGeometry, Mesh, Shape } from "three";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { V, V2d } from "../../core/Vector";
import MultiWall from "./MultiWall";
import { WALL_MATERIAL } from "./Wall";

export default class CurveWall extends BaseEntity implements Entity {
  constructor(
    curve: Bezier,
    segments: number = 20,
    width: number = 1.0,
    color?: number
  ) {
    super();

    const p2Points: V2d[] = curve
      .getLUT(segments)
      .map((point) => V(point.x, point.y));
    this.addChild(new MultiWall(p2Points, width, color));
  }
}
