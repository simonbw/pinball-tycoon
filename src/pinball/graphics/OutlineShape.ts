import { Shape } from "three";
import { V2d, V } from "../../core/Vector";
import { radToDeg, mod } from "../../core/util/MathUtil";

export function makeOutlineShape(points: readonly V2d[], width: number = 1.0) {
  const shape = new Shape();

  shape.moveTo(points[0].x, points[0].y);
  const processPoint = (current: V2d, last?: V2d, next?: V2d) => {
    if (!next && !last) {
      console.warn("this shouldn't be");
      shape.lineTo(current.x, current.y);
    }
    const n1 = last ? current.sub(last).inormalize().irotate90ccw() : undefined;
    const n2 = next ? current.sub(next).inormalize().irotate90cw() : undefined;

    if (n1 && !n2) {
      const result = current.add(n1.mul(width / 2));
      shape.lineTo(result.x, result.y);
    } else if (n2 && !n1) {
      const result = current.add(n2.mul(width / 2));
      shape.lineTo(result.x, result.y);
    } else if (n1 && n2) {
      // Imagine mitering two boards. l is the length along the cut end.
      const theta = (current.sub(last!).angle - current.sub(next!).angle) / 2;
      const l = ((1 / Math.abs(Math.sin(theta))) * width) / 2;
      const n = n1.add(n2).inormalize().imul(l);
      shape.lineTo(current.x + n.x, current.y + n.y);
    } else {
      // unreachable
    }
  };

  for (let i = 0; i < points.length; i++) {
    processPoint(points[i], points[i - 1], points[i + 1]);
  }

  for (let i = points.length - 1; i >= 0; i--) {
    processPoint(points[i], points[i + 1], points[i - 1]);
  }

  shape.closePath();

  return shape;
}
