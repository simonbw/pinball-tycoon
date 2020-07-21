import {
  AdditiveBlending,
  CircleBufferGeometry,
  Color,
  LinearFilter,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  PlaneBufferGeometry,
} from "three";
import BaseEntity from "../../../core/entity/BaseEntity";
import Entity from "../../../core/entity/Entity";
import { colorFade, darken, lighten } from "../../../core/util/ColorUtils";
import { lerp } from "../../../core/util/MathUtil";
import { createRadialGradient } from "../../graphics/proceduralTextures";

const UNLIT_EMISSIVE = new Color(0x000000);

const glowTexture = createRadialGradient(64, 1.4);
glowTexture.magFilter = LinearFilter;
glowTexture.minFilter = LinearFilter;
const glowMaterialTemplate = new MeshBasicMaterial({
  blending: AdditiveBlending,
  color: 0xaa0000,
  depthTest: true,
  depthWrite: false,
  map: glowTexture,
  polygonOffset: true,
  polygonOffsetFactor: -0.5,
  premultipliedAlpha: true,
  transparent: true,
});

const circleMaterialTemplate = new MeshStandardMaterial({
  transparent: true,
  color: 0x330000,
  roughness: 0.2,
  depthTest: true,
  depthWrite: false,
  emissive: UNLIT_EMISSIVE,
  polygonOffset: true,
  polygonOffsetFactor: -0.3,
});

export default class Lamp extends BaseEntity implements Entity {
  emissiveColor: number;
  glowColor: number;

  material: MeshStandardMaterial;
  glow: Object3D;
  glowMaterial: MeshBasicMaterial;

  private litPercent: number = 0;

  constructor(
    [x, y]: [number, number],
    color: number,
    size: number = 0.6,
    private toggleTime: number = 0.05
  ) {
    super();

    const materialColor = darken(color, 0.4);
    this.emissiveColor = lighten(color, 0.0);
    this.glowColor = darken(color, 0.3);

    const geometry = new CircleBufferGeometry(size, 32);
    this.material = circleMaterialTemplate.clone();
    this.material.color.set(materialColor);
    this.mesh = new Mesh(geometry, this.material);
    this.mesh.rotateX(Math.PI);
    this.mesh.position.set(x, y, 0);
    this.mesh.updateMatrix();
    this.mesh.matrixAutoUpdate = false;

    const glowGeometry = new PlaneBufferGeometry();
    this.glowMaterial = glowMaterialTemplate.clone();
    this.glowMaterial.color.set(0x000000);
    this.glow = new Mesh(glowGeometry, this.glowMaterial);
    this.glow.rotateX(Math.PI);
    this.glow.scale.set(size * 8, size * 8, 0);
    this.glow.position.set(x, y, -0.1);
    this.glow.updateMatrix();
    this.glow.matrixAutoUpdate = false;
    this.object3ds.push(this.glow);

    this.setPercentImmediate(0);

    this.disposeables.push(
      geometry,
      this.material,
      glowGeometry,
      this.glowMaterial
    );
  }

  setPercentImmediate(percent: number) {
    this.litPercent = percent;
    this.glow.visible = percent > 0;

    this.glowMaterial.color.set(colorFade(0x0, this.glowColor, percent));
    this.glowMaterial.needsUpdate = true;
    this.material.emissive.set(colorFade(0x0, this.emissiveColor, percent));
    this.material.needsUpdate = true;
  }

  async setPercentGradual(to: number, speed: number = this.toggleTime) {
    this.clearTimers();
    const from = this.litPercent;
    const totalTime = this.toggleTime * Math.abs(to - from);
    await this.wait(totalTime, (dt, t) => {
      this.setPercentImmediate(lerp(from, to, t));
    });
    this.setPercentImmediate(to);
  }

  flash(times: number, onDuration: number, offDuration: number) {}

  async setLit(on: boolean) {
    if (on) {
      this.light();
    } else {
      this.unlight();
    }
  }

  async light() {
    this.setPercentGradual(1);
  }

  async unlight() {
    this.setPercentGradual(0);
  }
}
