import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import Game from "../../core/Game";
import { PointLight } from "three";

const DEFAULT_DATA: LightData = {
  position: [0, 0, 1.0],
  color: 0xffffff,
  intensity: 1.0,
  linearFade: 0.0,
  quadraticFade: 0.0,
  radius: 0.0,
};

export default class Light extends BaseEntity implements Entity {
  tags = ["light"];
  lightData: LightData;
  light3: PointLight;

  constructor(lightData: Partial<LightData>) {
    super();
    this.lightData = { ...DEFAULT_DATA, ...lightData };

    this.light3 = new PointLight(
      this.lightData.color,
      this.lightData.intensity,
      undefined,
      2.0
    );
    this.light3.castShadow = true;
    this.light3.shadow.mapSize.height *= 4;
    this.light3.shadow.mapSize.width *= 4;
    this.light3.shadow.radius = 2.0;
    const [x, y, z] = this.lightData.position;
    this.light3.position.set(x, y, z); // TODO: Why is the z negative?
  }

  onAdd() {
    this.game?.renderer.scene.add(this.light3);
  }

  onDestroy(game: Game) {
    this.game?.renderer.scene.remove(this.light3);
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
  intensity: number;
  /** Coefficient for fading linearly with distance */
  linearFade: number;
  /** Coefficient for fading quadratically with distance */
  quadraticFade: number;
  /** Physical size of the light sphere, for determining distance. */
  radius: number;
}
