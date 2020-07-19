import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { BallsRemainingEvent } from "../system/LogicBoard";
import Lamp from "./Lamp";

export default class BallRemainingLamp extends BaseEntity implements Entity {
  lamp: Lamp;

  constructor(position: [number, number], private n: number) {
    super();

    this.lamp = this.addChild(new Lamp(position, 0xaa0000));
  }

  handlers = {
    ballsRemaining: ({ ballsRemaining }: BallsRemainingEvent) => {
      if (ballsRemaining >= this.n) {
        this.lamp.light();
      } else {
        this.lamp.unlight();
      }
    },
  };
}
