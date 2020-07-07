import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";

const DEFAULT_DATA: LightData = {
  position: [0, 0, 1.0],
  color: 0xffffff,
  power: 1.0,
  linearFade: 0.0,
  quadraticFade: 0.0,
  radius: 0.0,
};

export default class Light extends BaseEntity implements Entity {
  tags = ["light"];
  lightData: LightData;

  constructor(lightData: Partial<LightData>) {
    super();
    this.lightData = { ...DEFAULT_DATA, ...lightData };
  }
}

export function isLight(e?: Entity): e is Light {
  return e instanceof Light;
}

export interface LightData {
  /** Location in world space */
  position: [number, number, number];
  /** Hex value for color */
  color: number;
  /** Multiplies the intensity */
  power: number;
  /** Coefficient for fading linearly with distance */
  linearFade: number;
  /** Coefficient for fading quadratically with distance */
  quadraticFade: number;
  /** Physical size of the light sphere, for determining distance. */
  radius: number;
}
