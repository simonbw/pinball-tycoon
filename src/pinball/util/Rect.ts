import { V, V2d } from "../../core/Vector";

export class Rect {
  readonly top: number;
  readonly left: number;
  readonly bottom: number;
  readonly right: number;
  readonly width: number;
  readonly height: number;
  readonly center: V2d;

  get topLeft(): V2d {
    return V(this.left, this.top);
  }

  get topRight(): V2d {
    return V(this.right, this.top);
  }

  get bottomLeft(): V2d {
    return V(this.left, this.bottom);
  }

  get bottomRight(): V2d {
    return V(this.right, this.bottom);
  }

  get bottomMiddle(): V2d {
    return V(this.center.x, this.bottom);
  }

  get topMiddle(): V2d {
    return V(this.center.x, this.top);
  }

  get centerLeft(): V2d {
    return V(this.left, this.center.y);
  }

  get centerRight(): V2d {
    return V(this.right, this.center.y);
  }

  private constructor(
    top: number,
    bottom: number,
    left: number,
    right: number
  ) {
    this.left = left;
    this.top = top;
    this.right = right;
    this.bottom = bottom;
    this.width = right - left;
    this.height = bottom - top;
    this.center = V(this.left + this.width / 2, this.top + this.height / 2);
  }

  static fromCorners(
    [left, top]: [number, number],
    [right, bottom]: [number, number]
  ): Rect {
    return new Rect(top, bottom, left, right);
  }

  static fromTopLeft(
    [left, top]: [number, number],
    width: number,
    height: number
  ): Rect {
    return new Rect(top, top + height, left, left + width);
  }

  static fromBottomRight(
    [right, bottom]: [number, number],
    width: number,
    height: number
  ): Rect {
    return new Rect(bottom - height, bottom, right - width, right);
  }

  static fromCenter(
    [cx, cy]: [number, number],
    width: number,
    height: number
  ): Rect {
    return new Rect(
      cy - height / 2,
      cy + height / 2,
      cx - width / 2,
      cx + width / 2
    );
  }
}
