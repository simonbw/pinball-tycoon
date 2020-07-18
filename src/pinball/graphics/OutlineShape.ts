import { Shape } from "three";
import { V2d, V } from "../../core/Vector";

export function makeOutlineShape(points: readonly V2d[], width: number = 1.0) {
  const shape = new Shape();

  shape.moveTo(points[0][0], points[0][1]);
  const processPoint = (current: V2d, last?: V2d, next?: V2d) => {
    const n = V(0, 0);
    if (last) n.iadd(current.sub(last).inormalize().irotate90ccw());
    if (next) n.iadd(next.sub(current).inormalize().irotate90ccw());
    n.inormalize().imul(width / 2);

    shape.lineTo(current.x + n.x, current.y + n.y);
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
