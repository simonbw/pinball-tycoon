import {
  BufferGeometry,
  ExtrudeGeometry,
  Mesh,
  MeshStandardMaterial,
} from "three";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { clamp } from "../../core/util/MathUtil";
import { V2d } from "../../core/Vector";
import { makeOutlineShape } from "../util/OutlineShape";

const EXPAND_AMOUNT = 1.2;
const DURATION = 0.07;

const MATERIAL = new MeshStandardMaterial({
  color: 0xdd0000,
  roughness: 0.8,
  morphTargets: true,
});

export default class SlingshotMesh extends BaseEntity implements Entity {
  animationStartTime: number = -Infinity;
  mesh: Mesh;

  constructor(
    start: V2d,
    end: V2d,
    middlePercent: number = 0.5,
    width: number = 0.5
  ) {
    super();

    const geometry = this.makeGeometry(start, end, middlePercent, width, 0);
    const morphGeometry = this.makeGeometry(
      start,
      end,
      middlePercent,
      width,
      EXPAND_AMOUNT
    );

    geometry.morphTargets.push({
      name: "open",
      vertices: morphGeometry.vertices,
    });

    const bufferGeometry = new BufferGeometry().fromGeometry(geometry);
    this.mesh = new Mesh(bufferGeometry, MATERIAL);

    this.mesh.castShadow = true;
    this.mesh.receiveShadow = false;
  }

  makeGeometry(
    start: V2d,
    end: V2d,
    middlePercent: number,
    width: number,
    displacement: number
  ) {
    const normal = end.sub(start).irotate90ccw().inormalize();
    const midpoint = start
      .lerp(end, middlePercent)
      .add(normal.mul(displacement));

    const shape = makeOutlineShape([start, midpoint, end], width);
    const geometry = new ExtrudeGeometry(shape, {
      depth: 1.2,
      bevelEnabled: false,
    });
    geometry.translate(0, 0, -0.8);
    return geometry;
  }

  onRender() {
    const timeSinceHit = this.game!.elapsedTime - this.animationStartTime;
    const t = clamp(timeSinceHit, 0, DURATION) / DURATION;

    let d;
    const p = 0.2;
    if (t < p) {
      d = t / p;
    } else {
      d = 1.0 - t / (1.0 - p);
    }
    d = d ** 2;

    this.mesh.morphTargetInfluences![0] = d;
    this;
  }
}
