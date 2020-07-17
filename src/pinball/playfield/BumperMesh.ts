import { Color, MeshStandardMaterial } from "three";
import bumperModel from "../../../resources/models/bumperModel.glb";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { MODELS } from "../../core/resources/models";
import { clamp } from "../../core/util/MathUtil";
import Bumper from "./Bumper";

const ANIMATION_DURATION = 0.25;

export default class BumperMesh extends BaseEntity implements Entity {
  constructor(private bumper: Bumper, size: number = 1.7) {
    super();

    const [x, y] = bumper.body.position;
    this.mesh = MODELS.get(bumperModel)!.clone();
    this.mesh.rotateX(-Math.PI / 2);
    this.mesh.position.set(x, y, -size);
    this.mesh.scale.set(size, size, size);

    this.mesh.castShadow = true;
    this.mesh.receiveShadow = false;

    // Each bumper needs to have its own copy of the material
    this.mesh.material = (this.mesh.material as MeshStandardMaterial).clone();
    this.disposeables = [this.mesh.material];
  }

  onRender() {
    const timeSinceHit = this.game!.elapsedTime - this.bumper.lastHit;
    const t = 1.0 - clamp(timeSinceHit / ANIMATION_DURATION);
    (this.mesh!
      .material as MeshStandardMaterial).emissive = new Color().multiplyScalar(
      t ** 0.8
    );
  }
}
