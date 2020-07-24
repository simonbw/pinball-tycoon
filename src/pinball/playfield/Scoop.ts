import { Body, Box, ContactEquation, Shape } from "p2";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { SoundName } from "../../core/resources/sounds";
import { V, V2d } from "../../core/Vector";
import { isBall } from "../ball/Ball";
import { CollisionGroups } from "../Collision";
import { scoreEvent } from "../system/LogicBoard";

interface ScoopOptions {
  position: V2d;
  angle: number;
  width?: number;
  depth?: number;
  captureDuration?: number;
  getReleaseForce?: () => V2d;
  soundName?: SoundName;
}

/** Captures a ball for a duration then spits it back out */
export default class Scoop extends BaseEntity implements Entity {
  cooldown: boolean = false;

  constructor(
    position: V2d,
    angle: number = 0,
    width = 2.0,
    depth: number = 2.0,
    public captureDuration: number = 1.5,
    public getReleaseForce?: () => V2d,
    public onScoop?: () => void,
    public onRelease?: () => void
  ) {
    super();

    const sensorShape = new Box({ width, height: depth });
    sensorShape.collisionGroup = CollisionGroups.Table;
    sensorShape.collisionMask = CollisionGroups.Ball;

    this.body = new Body({ position, angle, collisionResponse: false });
    this.body.addShape(sensorShape);
  }

  async onBeginContact(
    ball: Entity,
    _: Shape,
    __: Shape,
    equations: ContactEquation[]
  ) {
    if (isBall(ball) && !this.cooldown) {
      // GOAL!
      equations.forEach((eq) => (eq.enabled = false));
      ball.capture();
      ball.body.position[0] = this.body!.position[0];
      ball.body.position[1] = this.body!.position[1];
      if (this.onScoop) {
        this.onScoop();
      } else {
        this.game!.dispatch(scoreEvent(1000));
      }

      await this.wait(this.captureDuration);

      ball.release();

      const impulse =
        this.getReleaseForce?.() ?? V(0, 100).irotate(this.body!.angle);
      ball.body.applyImpulse(impulse);
      this.cooldown = true;

      this.onRelease?.();

      await this.wait(0.5);

      this.cooldown = false;
    }
  }
}
