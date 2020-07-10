import Bezier from "bezier-js";
import { ExtrudeGeometry, Mesh, MeshStandardMaterial, Shape } from "three";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { Vector, V } from "../../core/Vector";
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

    const p2Points: Vector[] = curve
      .getLUT(segments)
      .map((point) => V(point.x, point.y));
    this.addChild(new MultiWall(p2Points, width, color));

    const shape = new Shape();

    const start = curve.offset(0, -width * 0.5);
    shape.moveTo(start.x, start.y);
    for (let i = 0.0; i < segments; i++) {
      const point = curve.offset(i / segments, -width * 0.5);
      shape.lineTo(point.x, point.y);
    }
    for (let i = segments; i > 0; i--) {
      const point = curve.offset(i / segments, width * 0.5);
      shape.lineTo(point.x, point.y);
    }
    shape.lineTo(start.x, start.y);

    const geometry = new ExtrudeGeometry(shape, {
      bevelEnabled: false,
      depth: -2.0,
    });
    this.mesh = new Mesh(geometry, WALL_MATERIAL);
  }

  makeMesh() {}
}
