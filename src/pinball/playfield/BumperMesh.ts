import {
  CylinderBufferGeometry,
  Mesh,
  MeshStandardMaterial,
  Color,
  LatheGeometry,
  Vector2,
} from "three";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { clamp } from "../../core/util/MathUtil";
import { TEXTURES } from "../graphics/textures";
import Bumper from "./Bumper";
import { rgbObjToHex, rgbToHex } from "../../core/util/ColorUtils";
import { MODELS } from "../../core/resources/models";
import bumperModel from "../../../resources/models/bumperModel.glb";
import { Material } from "p2";

const ANIMATION_DURATION = 0.25;

export default class BumperMesh extends BaseEntity implements Entity {
  topMaterial: MeshStandardMaterial;

  constructor(private bumper: Bumper, size: number = 1.7) {
    super();

    this.topMaterial = new MeshStandardMaterial({
      roughness: 0.0,
      map: TEXTURES.Bumper,
      emissiveMap: TEXTURES.BumperEmissive,
      emissive: 0,
    });
    const sideMaterial = new MeshStandardMaterial({
      roughness: 0.6,
      color: 0x555555,
    });

    // const height = 3;

    // const points = [
    //   new Vector2(0, 0),
    //   new Vector2(1.2 * size, 0),
    //   new Vector2(1.2 * size, 0.15),
    //   new Vector2(0.8 * size, 0.35),
    //   new Vector2(0.8 * size, 2.0),
    //   new Vector2(1.2 * size, 2.3),
    //   new Vector2(1.2 * size, 2.5),
    //   new Vector2(0.8 * size, 2.8),
    //   new Vector2(0 * size, 3),
    // ];
    // const geometry = new LatheGeometry(points);

    // geometry.rotateX(-Math.PI / 2);
    // geometry.translate(0, 0, -height / 2);

    // this.mesh = new Mesh(geometry, this.topMaterial);

    // const [x, y] = bumper.body.position;
    // this.mesh.position.set(x, y, 0);

    // this.mesh.castShadow = true;
    // this.mesh.receiveShadow = false;

    // this.disposeables = [geometry, this.topMaterial, sideMaterial];

    const [x, y] = bumper.body.position;
    this.mesh = MODELS.get(bumperModel)!.clone();
    this.mesh.material = (this.mesh.material as MeshStandardMaterial).clone();
    this.mesh.position.set(x, y, -size);
    this.mesh.rotateX(-Math.PI / 2);
    this.mesh.scale.set(size, size, size);

    // this.mesh.material = this.topMaterial;
  }

  onRender() {
    const timeSinceHit = this.game!.elapsedTime - this.bumper.lastHit;
    const p = 1.0 - clamp(timeSinceHit / ANIMATION_DURATION);
    (this.mesh!
      .material as MeshStandardMaterial).emissive = new Color().multiplyScalar(
      p ** 0.8
    );
    this.topMaterial.needsUpdate = true;
  }
}
