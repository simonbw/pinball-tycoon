import { ExtrudeBufferGeometry, Mesh } from "three";
import BaseEntity from "../../../core/entity/BaseEntity";
import Entity from "../../../core/entity/Entity";
import { V2d } from "../../../core/Vector";
import { makeOutlineShape } from "../../graphics/OutlineShape";
import Wall, { WALL_SIDE_MATERIAL, WALL_TOP_MATERIAL } from "./Wall";

export default class MultiWall extends BaseEntity implements Entity {
  constructor(
    points: readonly V2d[],
    width: number = 1.0,
    color?: number,
    renderSelf: boolean = true
  ) {
    super();
    if (points.length < 2) {
      throw new Error("Need at least 2 points for a multiwall.");
    }

    for (let i = 1; i < points.length; i++) {
      const start = points[i - 1];
      const end = points[i];
      this.addChild(new Wall(start, end, width, color, false));
    }

    if (renderSelf) {
      const shape = makeOutlineShape(points, width);

      const geometry = new ExtrudeBufferGeometry(shape, {
        bevelEnabled: false,
        depth: 2.0 * width,
      });
      geometry.translate(0, 0, -2 * width);
      this.mesh = new Mesh(geometry, [WALL_TOP_MATERIAL, WALL_SIDE_MATERIAL]);
      this.mesh.castShadow = true;
      this.mesh.receiveShadow = false;

      this.mesh.updateMatrix();
      this.mesh.matrixAutoUpdate = false;
    }
  }
}