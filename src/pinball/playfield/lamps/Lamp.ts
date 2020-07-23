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
import {
  colorLerp,
  darken,
  lighten,
  colorDistance,
} from "../../../core/util/ColorUtils";
import { lerp } from "../../../core/util/MathUtil";
import { createRadialGradient } from "../../graphics/proceduralTextures";

const UNLIT_EMISSIVE = new Color(0x000000);

const glowTexture = createRadialGradient(64, 1.4);
glowTexture.magFilter = LinearFilter;
glowTexture.minFilter = LinearFilter;
const GLOW_MATERIAL = new MeshBasicMaterial({
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

const BULB_MATERIAL = new MeshStandardMaterial({
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
  tags = ["lamp"];
  emissiveColor!: number;
  glowColor!: number;

  material: MeshStandardMaterial;
  glow: Object3D;
  glowMaterial: MeshBasicMaterial;

  private litPercent: number = 0;

  constructor(
    [x, y]: [number, number],
    private color: number,
    size: number = 0.6,
    private intensity: number = 1.0,
    private toggleTime: number = 0.06
  ) {
    super();

    const geometry = new CircleBufferGeometry(size, 32);
    this.material = BULB_MATERIAL.clone();
    this.mesh = new Mesh(geometry, this.material);
    this.mesh.rotateX(Math.PI);
    this.mesh.position.set(x, y, 0);
    this.mesh.updateMatrix();
    this.mesh.matrixAutoUpdate = false;

    const glowGeometry = new PlaneBufferGeometry();
    this.glowMaterial = GLOW_MATERIAL.clone();
    this.glowMaterial.color.set(0x000000);
    this.glow = new Mesh(glowGeometry, this.glowMaterial);
    this.glow.rotateX(Math.PI);
    this.glow.scale.set(size * 8, size * 8, 0);
    this.glow.position.set(x, y, -0.1);
    this.glow.updateMatrix();
    this.glow.matrixAutoUpdate = false;
    this.object3ds.push(this.glow);

    this.setBrightnessImmediate(0);
    this.setColorImmediate(color);

    this.disposeables.push(
      geometry,
      this.material,
      glowGeometry,
      this.glowMaterial
    );
  }

  setColorImmediate(color: number) {
    this.color = color;
    this.material.color.set(darken(color, 0.4));
    this.material.needsUpdate = true;
    this.emissiveColor = lighten(color, 0.0);
    this.glowColor = darken(color, 0.3);
  }

  async setColorGradual(to: number, maxTime: number = this.toggleTime) {
    this.clearTimers("color-timer");
    const from = this.color;
    const totalTime = maxTime * colorDistance(from, to);
    await this.wait(
      totalTime,
      (dt, t) => {
        this.setColorImmediate(colorLerp(from, to, t));
      },
      "color-timer"
    );
    this.setColorImmediate(to);
  }

  setBrightnessImmediate(percent: number) {
    this.litPercent = percent;
    this.glow.visible = percent > 0;

    const p = percent * this.intensity;
    this.glowMaterial.color.set(colorLerp(0x0, this.glowColor, p));
    this.glowMaterial.needsUpdate = true;
    this.material.emissive.set(colorLerp(0x0, this.emissiveColor, p));
    this.material.needsUpdate = true;
  }

  async setBrightnessGradual(to: number, maxTime: number = this.toggleTime) {
    this.clearTimers("percent-timer");
    const from = this.litPercent;
    const totalTime = maxTime * Math.abs(to - from);
    await this.wait(
      totalTime,
      (dt, t) => {
        this.setBrightnessImmediate(lerp(from, to, t));
      },
      "percent-timer"
    );
    this.setBrightnessImmediate(to);
  }

  stopTransitions() {
    this.clearTimers("percent-timer");
    this.clearTimers("color-timer");
  }

  async flash(
    times: number,
    onDuration: number = 0.13,
    offDuration: number = 0.13
  ) {
    for (let i = 0; i < times; i++) {
      await this.turnOn();
      await this.wait(onDuration);
      await this.turnOff();
      await this.wait(offDuration);
    }
  }

  async setLit(on: boolean) {
    if (on) {
      this.turnOn();
    } else {
      this.turnOff();
    }
  }

  async turnOn() {
    this.setBrightnessGradual(1);
  }

  async turnOff() {
    this.setBrightnessGradual(0);
  }
}
