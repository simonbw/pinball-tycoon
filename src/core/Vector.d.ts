type ArrayLen2 = [number, number];

export function V(a: ArrayLen2): Vector;
export function V(x: number, y: number): Vector;

interface Vector extends ArrayLen2 {
  constructor(x: number, y: number): void;

  x: number;

  y: number;

  /**
   * The magnitude (length) of this vector.
   * Changing it does not change the angle.
   */
  magnitude: number;

  /**
   * The angle in radians ccw from east of this vector.
   * Changing it does not change the magnitude.
   */
  angle: number;

  /** Return the result of adding this vector to another. */
  add(other: ArrayLen2): Vector;

  /** (In Place) Return the result of adding this vector to another. */
  iadd(other: ArrayLen2): this;

  /** Return the result of subtracting a vector from this one. */
  sub(other: ArrayLen2): Vector;

  /** (In Place) Return the result of subtracting a vector from this one. */
  isub(other: ArrayLen2): this;

  /** Return the result of multiplying this vector by a scalar. */
  mul(scalar: number): Vector;

  /** (In Place) Return the result of multiplying this vector by a scalar. */
  imul(scalar: number): this;

  /** Returns the result of rotating this vector 90 decgrees clockwise */
  rotate90cw(): Vector;

  /** (In Place) Returns the result of rotating this vector 90 decgrees clockwise */
  irotate90cw(): this;

  /** Returns the result of rotating this vector 90 decgrees counter-clockwise */
  rotate90ccw(): Vector;

  /** (In Place) Returns the result of rotating this vector 90 decgrees counter-clockwise */
  irotate90ccw(): this;

  /** Return the result of rotating this angle by `angle` radians ccw. */
  rotate(angle: number): Vector;

  /** (In Place) Return the result of rotating this angle by `angle` radians ccw. */
  irotate(angle: number): this;

  /** Return the dot product of this and another vector */
  dot(other: ArrayLen2): number;

  /** Set the components of this vector */
  set(other: ArrayLen2): this;
  set(x: number, y: number): this;

  /** Return a normalized version of this vector */
  normalize(): Vector;

  /** (In Place) Return a normalized version of this vector */
  inormalize(): this;

  /** Return a new vector with the same values as this one */
  clone(): Vector;

  /** Return a vector that is between this and other */
  lerp(other: ArrayLen2, t: number): Vector;

  /** (In place) Return a vector that is between this and other */
  ilerp(other: ArrayLen2, t: number): this;
}
