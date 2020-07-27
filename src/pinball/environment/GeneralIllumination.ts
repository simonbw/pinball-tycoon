import { HemisphereLight } from "three";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";

export default class GeneralIllumination extends BaseEntity implements Entity {
  light: HemisphereLight;
  constructor() {
    super();

    this.light = new HemisphereLight(0xffffff, 0x555555, 1);
    this.light.position.set(0, 0, -1);
    this.object3ds.push(this.light);

    this.light.intensity = 0;
  }

  handlers = {
    turnOn: async () => {
      await this.wait(0.5, (dt, t) => {
        this.light.intensity = t ** 2;
      });
      this.light.intensity = 1.0;
    },
  };
}
