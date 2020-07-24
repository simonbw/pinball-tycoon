import BaseEntity from "../../../core/entity/BaseEntity";
import Entity from "../../../core/entity/Entity";
import { BallsRemainingEvent } from "../../system/LogicBoard";
import Lamp from "./Lamp";

export default class BallRemainingLamp extends BaseEntity implements Entity {
  lamp: Lamp;
  lit: boolean = false;

  constructor(position: [number, number], private n: number) {
    super();
    this.lamp = this.addChild(new Lamp(position, { color: 0xaa0000 }));
  }

  handlers = {
    ballsRemaining: async ({ ballsRemaining }: BallsRemainingEvent) => {
      if (ballsRemaining >= this.n && !this.lit) {
        this.lit = true;
        await this.lamp.flash(2);
        this.lamp.turnOn();
      } else if (ballsRemaining < this.n && this.lit) {
        this.lit = false;
        await this.lamp.flash(2);
        this.lamp.turnOff();
      }
    },
  };
}
