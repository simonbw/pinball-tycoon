import { Matrix3, Path, Vector2 } from "three";
import { V, V2d } from "../../../core/Vector";

export function getNumberProp<T = 0>(
  value: string | number | null | undefined,
  backup?: T
): number | T {
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "string") {
    const f = parseFloat(value);
    if (!isNaN(f)) {
      return f;
    }
  }
  return arguments.length > 1 ? backup! : 0;
}

export function getNumberAttribute<T = 0>(
  node: Element,
  name: string,
  fallback?: T
) {
  if (arguments.length > 2) {
    return getNumberProp(node.getAttribute(name), fallback);
  } else {
    return getNumberProp(node.getAttribute(name));
  }
}

export function parsePointString(s: string): V2d[] {
  const values = s.split(/\s/).map((s) => parseFloat(s));
  const points = [];
  for (let i = 0; i < values.length - 1; i += 2) {
    const x = values[i];
    const y = values[i + 1];
    points.push(V(x, y));
  }
  return points;
}

/** Apply a 2d matrix transform to [x, y] */
export function transformPoint(x: number, y: number, m: Matrix3): V2d {
  return V(new Vector2(x, y).applyMatrix3(m).toArray());
}

export function getAngle(m: Matrix3): number {
  const a = m.elements[0];
  const b = m.elements[3];
  return Math.atan2(-b, a);
}

// TODO: Rewrite this in my code
export function svgArcToShapeArc(
  path: Path,
  rx: number,
  ry: number,
  angle: number,
  largeFlag: number,
  sweepFlag: number,
  start: Vector2,
  end: Vector2
) {
  angle = (angle * Math.PI) / 180;

  // Ensure radii are positive
  rx = Math.abs(rx);
  ry = Math.abs(ry);

  // Compute (x1′, y1′)
  const dx2 = (start.x - end.x) / 2.0;
  const dy2 = (start.y - end.y) / 2.0;
  const x1p = Math.cos(angle) * dx2 + Math.sin(angle) * dy2;
  const y1p = -Math.sin(angle) * dx2 + Math.cos(angle) * dy2;

  // Compute (cx′, cy′)
  let rxs = rx * rx;
  let rys = ry * ry;
  const x1ps = x1p * x1p;
  const y1ps = y1p * y1p;

  // Ensure radii are large enough
  const cr = x1ps / rxs + y1ps / rys;

  if (cr > 1) {
    // scale up rx,ry equally so cr == 1
    const s = Math.sqrt(cr);
    rx = s * rx;
    ry = s * ry;
    rxs = rx * rx;
    rys = ry * ry;
  }

  const dq = rxs * y1ps + rys * x1ps;
  const pq = (rxs * rys - dq) / dq;
  let q = Math.sqrt(Math.max(0, pq));
  if (largeFlag === sweepFlag) {
    q = -q;
  }
  const cxp = (q * rx * y1p) / ry;
  const cyp = (-q * ry * x1p) / rx;

  // Step 3: Compute (cx, cy) from (cx′, cy′)
  const cx =
    Math.cos(angle) * cxp - Math.sin(angle) * cyp + (start.x + end.x) / 2;
  const cy =
    Math.sin(angle) * cxp + Math.cos(angle) * cyp + (start.y + end.y) / 2;

  // Step 4: Compute θ1 and Δθ
  const theta = svgAngle(1, 0, (x1p - cxp) / rx, (y1p - cyp) / ry);
  const delta =
    svgAngle(
      (x1p - cxp) / rx,
      (y1p - cyp) / ry,
      (-x1p - cxp) / rx,
      (-y1p - cyp) / ry
    ) %
    (Math.PI * 2);

  path.absellipse(cx, cy, rx, ry, theta, theta + delta, sweepFlag === 0, angle);
}

// TODO: Rewrite this in my code
function svgAngle(ux: number, uy: number, vx: number, vy: number) {
  const dot = ux * vx + uy * vy;
  const len = Math.sqrt(ux * ux + uy * uy) * Math.sqrt(vx * vx + vy * vy);
  let ang = Math.acos(Math.max(-1, Math.min(1, dot / len))); // floating point precision, slightly over values appear
  if (ux * vy - uy * vx < 0) ang = -ang;
  return ang;
}
