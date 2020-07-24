import BaseEntity from "../../../core/entity/BaseEntity";
import Entity from "../../../core/entity/Entity";
import { BallSaveChangeEvent } from "../../system/BallSaveSystem";
import Lamp from "./Lamp";

export default class BallSaveLamp extends BaseEntity implements Entity {
  lamp: Lamp;
  on: boolean = false;

  constructor(position: [number, number]) {
    super();
    this.lamp = this.addChild(new Lamp(position, { color: 0x0000dd }));
  }

  handlers = {
    ballSaveChange: async ({ active }: BallSaveChangeEvent) => {
      await this.lamp.flash(3);
      await this.lamp.setLit(active);
    },
  };
}
