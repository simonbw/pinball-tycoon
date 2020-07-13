import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { Vector, V } from "../../core/Vector";
import Wall, { WALL_MATERIAL } from "./Wall";
import { Shape, ExtrudeBufferGeometry, Mesh } from "three";

export default class MultiWall extends BaseEntity implements Entity {
  constructor(
    points: readonly Vector[],
    width: number = 1.0,
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
      this.addChild(new Wall(start, end, width, color, false));
    }

    if (renderSelf) {
      const shape = new Shape();

      shape.moveTo(points[0][0], points[0][1]);
      const processPoint = (current: Vector, last?: Vector, next?: Vector) => {
        const n = V(0, 0);
        if (last) n.iadd(current.sub(last).inormalize().irotate90ccw());
        if (next) n.iadd(next.sub(current).inormalize().irotate90ccw());
        n.inormalize().imul(width / 2);

        shape.lineTo(current.x + n.x, current.y + n.y);
      };

      // shape
      for (let i = 0; i < points.length; i++) {
        const last = points[i - 1];
        const current = points[i];
        const next = points[i + 1];

        processPoint(current, last, next);
      }

      for (let i = points.length - 1; i > 0; i--) {
        const last = points[i + 1];
        const current = points[i];
        const next = points[i - 1];

        processPoint(current, last, next);
      }

      shape.closePath();

      const geometry = new ExtrudeBufferGeometry(shape, {
        bevelEnabled: false,
        depth: 2.0 * width,
      });
      geometry.translate(0, 0, -2 * width);
      this.mesh = new Mesh(geometry, WALL_MATERIAL);
    }
  }
}
