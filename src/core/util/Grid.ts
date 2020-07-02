import { Vector } from "../Vector";

// A 2 dimensional map.
export default class Grid<T> {
  data: { [x: number]: { [y: number]: T } } = {};

  set([x, y]: Vector, value: T) {
    if (this.data[x] == null) {
      this.data[x] = {};
    }
    this.data[x][y] = value;
  }

  get([x, y]: Vector) {
    if (!this.data.hasOwnProperty(x)) {
      return undefined;
    }
    return this.data[x][y];
  }
}
