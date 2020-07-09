export type Vector = [number, number];

declare global {
  interface Array<T> {
    /** Alias for v[0] */
    x: number;
    /** Alias for v[1] */
    y: number;

    magnitude: number;
    /** The angle in radians ccw from east of this vector. */
    angle: number;

    /** Return the result of adding this vector to another. */
    add(other: Vector): Vector;
    /** (In Place) Return the result of adding this vector to another. */
    iadd(other: Vector): Vector;
    /** Return the result of subtracting a vector from this one. */
    sub(other: Vector): Vector;
    /** (In Place) Return the result of subtracting a vector from this one. */
    isub(other: Vector): Vector;
    /** Return the result of multiplying this vector by a scalar. */
    mul(scalar: number): Vector;
    /** (In Place) Return the result of multiplying this vector by a scalar. */
    imul(scalar: number): Vector;
    /** Returns the result of rotating this vector 90 decgrees clockwise */
    rotate90cw(): Vector;
    /** (In Place) Returns the result of rotating this vector 90 decgrees clockwise */
    irotate90cw(): Vector;
    /** Returns the result of rotating this vector 90 decgrees counter-clockwise */
    rotate90ccw(): Vector;
    /** (In Place) Returns the result of rotating this vector 90 decgrees counter-clockwise */
    irotate90ccw(): Vector;
    /** Return the result of rotating this angle by `angle` radians ccw. */
    rotate(radians: number): Vector;
    /** (In Place) Return the result of rotating this angle by `angle` radians ccw. */
    irotate(radians: number): Vector;
    /** Return the dot product of this and another vector */
    dot(other: Vector): number;
    /** Set the components of this vector */
    set(x: number, y: number): Vector;
    /** Set the components of this vector from another */
    set(other: Vector): Vector;
    /** Return a normalized version of this vector */
    normalize(): Vector;
    /** (In Place) Return a normalized version of this vector */
    inormalize(): Vector;
    /** Return a new vector with the same values as this one */
    clone(): Vector;
  }
}

/**
 * Adds methods to Array that are meant to be used on 2 dimensional arrays.
 * Methods that return a vector have in-place versions prefixed with "i".
 *
 * TODO: Make these work with more dimensions.
 */
export function polyfillArrayAsVector(Array: any) {
  Array.prototype.add = function (other: Vector) {
    return [this[0] + other[0], this[1] + other[1]];
  };

  Array.prototype.iadd = function (other: Vector) {
    this[0] += other[0];
    this[1] += other[1];
    return this;
  };

  Array.prototype.sub = function (other: Vector) {
    return [this[0] - other[0], this[1] - other[1]];
  };

  Array.prototype.isub = function (other: Vector): Vector {
    this[0] -= other[0];
    this[1] -= other[1];
    return this;
  };

  Array.prototype.mul = function (scalar: number) {
    return [this[0] * scalar, this[1] * scalar];
  };

  Array.prototype.imul = function (scalar: number): Vector {
    this[0] *= scalar;
    this[1] *= scalar;
    return this;
  };

  Array.prototype.rotate90cw = function () {
    return [this[1], -this[0]];
  };

  Array.prototype.irotate90cw = function () {
    [this[0], this[1]] = [this[1], -this[0]];
    return this;
  };

  Array.prototype.rotate90ccw = function () {
    return [-this[1], this[0]];
  };

  Array.prototype.irotate90ccw = function () {
    [this[0], this[1]] = [-this[1], this[0]];
    return this;
  };

  Array.prototype.rotate = function (angle: number) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const x = this[0];
    const y = this[1];
    return [cos * x - sin * y, sin * x + cos * y];
  };

  Array.prototype.irotate = function (angle: number) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const x = this[0];
    const y = this[1];
    this[0] = cos * x - sin * y;
    this[1] = sin * x + cos * y;
    return this;
  };

  Array.prototype.dot = function (other: Vector) {
    return this[0] * other[0] + this[1] * other[1];
  };

  Array.prototype.set = function (x: number | Vector, y: number) {
    if (typeof x === "number") {
      this[0] = x;
      this[1] = y;
    } else {
      this[0] = x[0];
      this[1] = x[1];
    }
    return this;
  };

  Array.prototype.inormalize = function () {
    if (this[0] === 0 && this[1] === 0) {
      return [0, 0];
    } else {
      this.magnitude = 1;
      return this;
    }
  };

  Array.prototype.normalize = function () {
    if (this[0] === 0 && this[1] === 0) {
      return [0, 0];
    }
    const magnitude = this.magnitude;
    return this.mul(1 / magnitude);
  };

  Array.prototype.clone = function () {
    return [this[0], this[1]];
  };

  /**
   * Alias for [0].
   */
  Object.defineProperty(Array.prototype, "x", {
    get: function () {
      return this[0];
    },
    set: function (value) {
      return (this[0] = value);
    },
  });

  /**
   * Alias for [1]
   */
  Object.defineProperty(Array.prototype, "y", {
    get: function () {
      return this[1];
    },
    set: function (value) {
      return (this[1] = value);
    },
  });

  /**
   * The magnitude (length) of this vector.
   * Changing it does not change the angle.
   */
  Object.defineProperty(Array.prototype, "magnitude", {
    get: function () {
      return Math.sqrt(this[0] * this[0] + this[1] * this[1]) || 0;
    },
    set: function (value) {
      if (this[0] !== 0 || this[1] !== 0) {
        this.imul(value / this.magnitude);
      }
    },
  });

  /**
   * The angle in radians ccw from east of this vector.
   * Changing it does not change the magnitude.
   */
  Object.defineProperty(Array.prototype, "angle", {
    get: function () {
      return Math.atan2(this[1], this[0]);
    },
    set: function (value) {
      return this.irotate(value - this.angle);
    },
  });
}
