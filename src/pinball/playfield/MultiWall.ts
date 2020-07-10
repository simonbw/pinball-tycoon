import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { Vector } from "../../core/Vector";
import Wall, { WALL_MATERIAL } from "./Wall";
import { Shape, ExtrudeGeometry, Mesh } from "three";

export default class MultiWall extends BaseEntity implements Entity {
  constructor(
    points: readonly Vector[],
    width?: number,
    color?: number,
    renderSelf: boolean = true
  ) {
    super();
    if (points.length < 2) {
      throw new Error("Need at least 2 points for a multiwall.");
    }

    for (let i = 1; i < points.length; i++) {
      const start = points[i - 1];
      const end = points[i];
      this.addChild(new Wall(start, end, width, color, renderSelf));
    }

    // const shape = new Shape();

    // shape
    // for (let i = 1; i < points.length; i++) {
    //   const start = points[i - 1];
    //   const end = points[i];
    // }

    // const geometry = new ExtrudeGeometry(shape, {
    //   bevelEnabled: false,
    //   depth: -2.0,
    // });
    // this.mesh = new Mesh(geometry, WALL_MATERIAL);
  }
}
