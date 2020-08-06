import { Body, Box, ContactEquation, Shape } from "p2";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { SoundName } from "../../core/resources/sounds";
import { degToRad } from "../../core/util/MathUtil";
import { rNormal, rUniform } from "../../core/util/Random";
import { V, V2d } from "../../core/Vector";
import { isBall } from "../ball/Ball";
import { CollisionGroups } from "../Collision";
import { PositionalSound } from "../sound/PositionalSound";
import { scoreEvent } from "../system/LogicBoard";

interface ScoopOptions {
  position: V2d;
  angle: number;
  width?: number;
  depth?: number;
  captureDuration?: number;
  soundName?: SoundName;
  getReleaseForce?: () => V2d;
  onScoop?: () => void;
  onRelease?: () => void;
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

  private _getReleaseForce() {
    if (this.getReleaseForce) {
      return this.getReleaseForce();
    } else {
      return V(0, rUniform(400, 500)).irotate(
        this.body!.angle + rNormal(0, degToRad(0))
      );
    }
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
        this.addChild(new PositionalSound("suck1", this.getPosition()));
      }

      await this.wait(this.captureDuration);

      ball.release();

      const impulse = this._getReleaseForce();
      ball.body.applyImpulse(impulse);
      this.cooldown = true;

      if (this.onRelease) {
        this.onRelease();
      } else {
        this.addChild(
          new PositionalSound("pop1", this.getPosition(), { speed: 0.5 })
        );
        this.game!.dispatch(scoreEvent(1000));
      }

      await this.wait(0.5);

      this.cooldown = false;
    }
  }
}
