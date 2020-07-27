import { V2d, V } from "../Vector";
import { Shape } from "p2";
import { Path, LineCurve, Matrix3 } from "three";
import { transformPoint } from "../../pinball/tables/SvgTable/svgUtils";

// Modulo operator for modular arithmetic
export function mod(a: number, b: number): number {
  return ((a % b) + b) % b;
}

// Limit a value to be in a range.
export function clamp(value: number, min = 0, max = 1): number {
  return Math.max(min, Math.min(max, value));
}

// The smoothstep function between 0 and 1
export function smoothStep(value: number): number {
  value = clamp(value);
  return value * value * (3 - 2 * value);
}

export function lerp(a: number, b: number, t: number = 0.5): number {
  return (1 - t) * a + t * b;
}

export function lerpOrSnap(
  a: number,
  b: number,
  t: number = 0.5,
  threshold: number = 0.01
): number {
  if (Math.abs(b - a) < threshold) {
    return b;
  }
  return lerp(a, b, t);
}

export function smoothstep(t: number): number {
  t = clamp(t);
  return 3 * t ** 2 - 2 * t ** 3;
}

export function smootherstep(t: number): number {
  t = clamp(t);
  return 6 * t ** 5 - 15 * t ** 4 + 10 * t ** 3;
}

/** Normalizes an angle in radians to be in the range [-pi, pi] */
export function normalizeAngle(angle: number) {
  return mod(angle + Math.PI, Math.PI * 2) - Math.PI;
}

// Return the difference between two angles
export function angleDelta(a: number, b: number): number {
  return mod(b - a + Math.PI, Math.PI * 2) - Math.PI;
}

export function degToRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function radToDeg(radians: number): number {
  return (radians * 180) / Math.PI;
}

/** Returns the result of reflecting an angle across the X axis. */
export function reflectX(theta: number): number {
  return normalizeAngle(Math.PI - theta);
}

/** Returns the result of reflecting an angle across the Y axis. */
export function reflectY(theta: number): number {
  return normalizeAngle(-theta);
}

export function reflectXY(theta: number): number {
  return normalizeAngle(theta - Math.PI);
}

export function polarToVec(theta: number, r: number): V2d {
  return V(r * Math.cos(theta), r * Math.sin(theta));
}

export function isCCW(points: readonly V2d[]): boolean {
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    const [x1, y1] = points[i - 1];
    const [x2, y2] = points[i];
    total += (x2 - x1) * (y2 + y1);
  }
  return total > 0;
}

export function pathToPoints(
  path: Path,
  transform?: Matrix3,
  segmentDensity = 0.9
) {
  const points: V2d[] = [];

  for (const curve of path.curves) {
    const segments = Math.ceil(curve.getLength() * segmentDensity);

    const curvePoints =
      curve instanceof LineCurve
        ? curve.getPoints(1)
        : curve.getPoints(segments);

    for (const point of curvePoints) {
      const p = transform
        ? transformPoint(point.x, point.y, transform)
        : V(point.x, point.y);
      if (!p.equals(points[points.length - 1])) {
        points.push(p);
      }
    }
  }
  if (points[0].equals(points[points.length - 1])) {
    points.pop();
  }

  return points;
}
