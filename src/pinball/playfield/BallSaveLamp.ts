import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { BallsRemainingEvent } from "../system/LogicBoard";
import Lamp from "./Lamp";
import { KeyCode } from "../../core/io/Keys";

export default class BallSaveLamp extends BaseEntity implements Entity {
  lamp: Lamp;
  on: boolean = false;

  constructor(position: [number, number]) {
    super();
    this.lamp = this.addChild(new Lamp(position, 0x0000dd));
  }

  onKeyDown(key: KeyCode) {
    if (key === "KeyF") {
      this.on = !this.on;
      this.lamp.setLit(this.on);
    }
  }
}
