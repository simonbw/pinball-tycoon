import { SpotLight, SpotLightHelper } from "three";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { V2d } from "../../core/Vector";
import { getGraphicsQuality } from "../controllers/GraphicsQualityController";

export default class OverheadLight extends BaseEntity implements Entity {
  light: SpotLight;

  constructor([x, y]: V2d, color: number = 0xfafcff, intensity: number = 50) {
    super();

    this.light = new SpotLight(color, intensity);
    this.light.position.set(x, y, -90);
    this.object3ds.push(this.light);
    this.updateQuality();
  }

  updateQuality() {
    this.light.castShadow = getGraphicsQuality() === "high";
  }

  handlers = {
    setQuality: () => this.updateQuality(),
  };
}
