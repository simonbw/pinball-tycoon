import { Mesh, MeshPhysicalMaterial, PlaneBufferGeometry } from "three";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { Rect } from "../util/Rect";
import { getGraphicsQuality } from "../controllers/GraphicsQualityController";

/**
 * The main boundary of the game, makes sure the ball can't possibly be in weird places.
 */
export default class Topglass extends BaseEntity implements Entity {
  constructor({ width, height, center }: Rect, z: number, slope: number = 0) {
    super();

    const material = new MeshPhysicalMaterial({
      // color: new Color(),
      transparent: true,
      roughness: 0.01,
      reflectivity: 1,
      metalness: 0.5,
      opacity: 0.3,
    });
    material.transparency = 0.68;

    const geometry = new PlaneBufferGeometry(width, height, 1, 1);

    geometry.rotateX(Math.PI + slope);

    this.mesh = new Mesh(geometry, material);
    this.mesh.position.set(center.x, center.y, z);
    this.mesh.castShadow = false;
    this.mesh.receiveShadow = false;
    this.updateForQuality();

    this.disposeables = [material, geometry];

    this.mesh.renderOrder = 1;
  }

  updateForQuality() {
    this.mesh!.visible = getGraphicsQuality() !== "low";
  }

  handlers = {
    setQuality: () => {
      this.updateForQuality();
    },
  };
}
