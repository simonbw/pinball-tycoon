import { Mesh, MeshPhysicalMaterial, PlaneBufferGeometry } from "three";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { Rect } from "../util/Rect";

/**
 * The main boundary of the game, makes sure the ball can't possibly be in weird places.
 */
export default class Topglass extends BaseEntity implements Entity {
  constructor({ width, height, center }: Rect, z: number) {
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

    const geometry = new PlaneBufferGeometry(width, height, 1, 1);

    geometry.rotateX(Math.PI);

    this.mesh = new Mesh(geometry, material);
    this.mesh.position.set(center.x, center.y, z);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    this.mesh = undefined;

    this.disposeables = [material, geometry];
  }
}
