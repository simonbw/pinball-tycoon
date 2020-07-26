import { MeshStandardMaterial } from "three";
import { V2d } from "../../../core/Vector";
import MultiWall from "./MultiWall";

export default class Wall extends MultiWall {
  constructor(
    start: V2d,
    end: V2d,
    width?: number,
    color?: number,
    renderSelf?: boolean
  ) {
    super([start, end], width, color, renderSelf);
  }
}
