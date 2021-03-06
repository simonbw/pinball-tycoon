import { Body, Circle } from "p2";
import { MeshStandardMaterial } from "three";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { V, V2d } from "../../core/Vector";
import Ball, { isBall } from "../ball/Ball";
import Lamp from "./lamps/Lamp";
import { scoreEvent } from "../system/LogicBoard";
import { SoundInstance } from "../sound/SoundInstance";

export interface RolloverEvent {
  type: "rollover";
  rollover: Rollover;
  id?: string;
  ball: Ball;
  skipFlash: () => void;
}

interface RolloverOptions {
  direction?: number;
  color?: number;
  score?: number;
}

export default class Rollover extends BaseEntity implements Entity {
  tags = ["rollover"];
  lamp: Lamp;
  direction: V2d | undefined;
  score: number;
  cooldown: boolean = false;

  constructor(
    position: [number, number],
    radius: number = 1.0,
    { direction, color, score }: RolloverOptions = {}
  ) {
    super();
    this.score = score ?? 1000;

    if (direction != undefined) {
      this.direction = V(Math.cos(direction), Math.sin(direction));
    }

    this.body = new Body({ position: V(position), collisionResponse: false });
    const shape = new Circle({ radius });
    this.body.addShape(shape);

    this.lamp = this.addChild(new Lamp(position, { color }));
  }

  async onRollover(shouldFlash: boolean = true) {
    this.cooldown = true;
    if (this.score > 0) {
      this.addChild(new SoundInstance("defenderDown3"));
      this.game!.dispatch(scoreEvent(this.score));
    }
    if (shouldFlash) await this.lamp.flash(4, 0.08, 0.08);
    this.cooldown = false;
  }

  directionMatches(velocity: [number, number]) {
    if (this.direction == undefined) {
      return true;
    }

    return this.direction.dot(velocity) >= 0;
  }

  async onBeginContact(ball: Entity) {
    if (isBall(ball)) {
      if (!this.cooldown && this.directionMatches(ball.body.velocity)) {
        let shouldFlash = true;
        const e: RolloverEvent = {
          type: "rollover",
          id: this.id,
          ball,
          rollover: this,
          skipFlash: () => {
            shouldFlash = false;
          },
        };
        this.game!.dispatch(e);
        this.onRollover(shouldFlash);
        await this.wait(0.2);
      }
    }
  }

  handlers = {
    gameStart: () => {
      this.lamp.flash(5);
    },
  };
}
