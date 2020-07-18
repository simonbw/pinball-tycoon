import { Mesh, MeshPhysicalMaterial, PlaneBufferGeometry } from "three";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { V } from "../../core/Vector";
import { Rect } from "../util/Rect";

/**
 * The main boundary of the game, makes sure the ball can't possibly be in weird places.
 */
export default class Topglass extends BaseEntity implements Entity {
  constructor({ top, bottom, left, right }: Rect, z: number) {
    super();

    const material = new MeshPhysicalMaterial({
      // color: new Color(),
      transparent: true,
      roughness: 0.01,
      reflectivity: 1,
      metalness: 0.5,
      opacity: 0.5,
    });
    material.transparency = 0.88;

    const width = right - left;
    const height = bottom - top;
    const geometry = new PlaneBufferGeometry(width, height, 1, 1);

    geometry.rotateX(Math.PI);

    const [cx, cy] = V(left, top).iadd([right, bottom]).imul(0.5);

    this.mesh = new Mesh(geometry, material);
    this.mesh.position.set(cx, cy, z);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    this.mesh = undefined;

    this.disposeables = [material, geometry];
  }
}
