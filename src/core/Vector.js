import { lerp } from "./util/MathUtil";

export function V(x, y) {
  if (x instanceof Vector) {
    return x;
  } else if (x instanceof Array) {
    return new Vector(x[0], x[1]);
  }
  return new Vector(x, y);
}

export class Vector extends Array {
  constructor(x, y) {
    super();
    this[0] = x;
    this[1] = y;
  }

  get v() {
    return this;
  }

  /** Return the result of adding this vector to another. */
  add(other) {
    return this.clone().iadd(other);
  }

  /** (In Place) Return the result of adding this vector to another. */
  iadd(other) {
    this[0] += other[0];
    this[1] += other[1];
    return this;
  }

  /** Return the result of subtracting a vector from this one. */
  sub(other) {
    return this.clone().isub(other);
  }

  /** (In Place) Return the result of subtracting a vector from this one. */
  isub(other) {
    this[0] -= other[0];
    this[1] -= other[1];
    return this;
  }

  /** Return the result of multiplying this vector by a scalar. */
  mul(scalar) {
    return this.clone().imul(scalar);
  }

  /** (In Place) Return the result of multiplying this vector by a scalar. */
  imul(scalar) {
    this[0] *= scalar;
    this[1] *= scalar;
    return this;
  }

  /** Returns the result of rotating this vector 90 decgrees clockwise */
  rotate90cw() {
    return new Vector(this[1], -this[0]);
  }

  /** (In Place) Returns the result of rotating this vector 90 decgrees clockwise */
  irotate90cw() {
    [this[0], this[1]] = [this[1], -this[0]];
    return this;
  }

  /** Returns the result of rotating this vector 90 decgrees counter-clockwise */
  rotate90ccw() {
    return new Vector(-this[1], this[0]);
  }

  /** (In Place) Returns the result of rotating this vector 90 decgrees counter-clockwise */
  irotate90ccw() {
    [this[0], this[1]] = [-this[1], this[0]];
    return this;
  }

  /** Return the result of rotating this angle by `angle` radians ccw. */
  rotate(angle) {
    return this.clone().irotate(angle);
  }

  /** (In Place) Return the result of rotating this angle by `angle` radians ccw. */
  irotate(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const x = this[0];
    const y = this[1];
    this[0] = cos * x - sin * y;
    this[1] = sin * x + cos * y;
    return this;
  }

  /** Return the dot product of this and another vector */
  dot(other) {
    return this[0] * other[0] + this[1] * other[1];
  }

  /** Set the components of this vector */
  set(x, y) {
    if (typeof x === "number") {
      this[0] = x;
      this[1] = y;
    } else {
      this[0] = x[0];
      this[1] = x[1];
    }
    return this;
  }

  /** Return a normalized version of this vector */
  normalize() {
    return this.clone().inormalize();
  }

  /** (In Place) Return a normalized version of this vector */
  inormalize() {
    if (!(this[0] === 0 && this[1] === 0)) {
      this.magnitude = 1;
    }
    return this;
  }

  /** Return a new vector with the same values as this one */
  clone() {
    return new Vector(this[0], this[1]);
  }

  /** Return a vector that is between this and other */
  lerp(other, t = 0) {
    return this.clone().ilerp(other, t);
  }

  /** (In place) Return a vector that is between this and other */
  ilerp(other, t = 0) {
    this[0] = lerp(this[0], other[0], t);
    this[1] = lerp(this[1], other[1], t);
    return this;
  }

  /**
   * Alias for [0].
   */
  get x() {
    return this[0];
  }

  set x(value) {
    this[0] = value;
  }

  /**
   * Alias for [1]
   */
  get y() {
    return this[1];
  }
  set y(value) {
    this[1] = value;
  }

  /**
   * The magnitude (length) of this vector.
   * Changing it does not change the angle.
   */
  get magnitude() {
    return Math.sqrt(this[0] * this[0] + this[1] * this[1]) || 0;
  }
  set magnitude(value) {
    if (this[0] !== 0 || this[1] !== 0) {
      this.imul(value / this.magnitude);
    }
  }

  /**
   * The angle in radians ccw from east of this vector.
   * Changing it does not change the magnitude.
   */
  get angle() {
    return Math.atan2(this[1], this[0]);
  }
  set angle(value) {
    this.irotate(value - this.angle);
  }
}