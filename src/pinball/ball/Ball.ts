import { Body, Circle, ContactEquation, Shape } from "p2";
import { Vector3 } from "three";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import CCDBody from "../../core/physics/CCDBody";
import { clamp, degToRad } from "../../core/util/MathUtil";
import { V, V2d } from "../../core/Vector";
import { NudgeEvent } from "../controllers/NudgeController";
import { CollisionGroups } from "../Collision";
import { P2Materials } from "../playfield/Materials";
import {
  BallCollisionInfo,
  hasCollisionInfo,
  WithBallCollisionInfo,
} from "./BallCollisionInfo";
import BallMesh from "./BallMesh";
import BallSoundController from "./BallSoundController";

const RADIUS = 1.0625; // Radius in 1/2 inches
const MASS = 2.8; // In ounces
const FRICTION = 0.005; // rolling friction
const TABLE_ANGLE = degToRad(4); // amount of tilt in the table
const GRAVITY = 2.0 * 386.0 * Math.sin(TABLE_ANGLE); // 1/2 inches/s^2

export default class Ball extends BaseEntity
  implements Entity, WithBallCollisionInfo {
  tags = ["ball"];
  body: Body;
  radius: number = RADIUS;
  captured: boolean = false;
  angularMomentum: Vector3 = new Vector3();
  soundController: BallSoundController;
  ballCollisionInfo: BallCollisionInfo = {
    beginContactSound: "postHit",
  };

  constructor(position: V2d, velocity: V2d = V(0, 0)) {
    super();

    this.body = new CCDBody({
      mass: MASS,
      ccdSpeedThreshold: 30, // I think this can help performance a lot
      ccdIterations: 5,
    });
    this.body.position = position;
    this.body.velocity = velocity;

    const shape = new Circle({ radius: this.radius });
    shape.material = P2Materials.ball;
    shape.collisionGroup = CollisionGroups.Ball;
    shape.collisionMask = CollisionGroups.Ball | CollisionGroups.Table;
    this.body.addShape(shape);

    this.addChild(new BallMesh(this));
    this.soundController = this.addChild(new BallSoundController(this));
    // this.addChild(new PuckMesh(this));
  }

  /** The height of the bottom of the ball above the playfield */
  getHeight(): number {
    if (this.captured) {
      return -this.radius / 3;
    }
    return 0;
  }

  getPosition3() {
    const [x, y] = this.getPosition();
    const z = this.getHeight() + this.radius;
    return new Vector3(x, y, z);
  }

  onTick(dt: number) {
    // Gravity
    if (!this.captured) {
      this.body.applyForce([0, GRAVITY * MASS]);

      // Spin
      const spinForce = V(this.body.velocity)
        .inormalize()
        .irotate90cw()
        .imul(this.body.angularVelocity * 0.05);
      this.body.applyForce(spinForce);

      // Friction
      const frictionForce = V(this.body.velocity).mul(-FRICTION);
      this.body.applyForce(frictionForce);

      // TODO: Better angular momentum
      const n2d = V(this.body.velocity).rotate90cw().imul(RADIUS);
      this.angularMomentum.set(n2d.x, n2d.y, 0);
    }
  }

  // Ball gets controlled by other entity
  capture() {
    this.captured = true;
    this.body.collisionResponse = false;
    this.body.velocity[0] = 0;
    this.body.velocity[1] = 0;
    this.body.angularVelocity = 0;
    this.angularMomentum.set(0, 0, 0);
  }

  release() {
    this.captured = false;
    this.body.collisionResponse = true;
  }

  handlers = {
    nudge: async (e: NudgeEvent) => {
      this.body.applyImpulse(e.impulse);
      await this.wait(e.duration / 2);
      this.body.applyImpulse(e.impulse.mul(-2));
      await this.wait(e.duration / 2);
      this.body.applyImpulse(e.impulse);
    },
  };

  onBeginContact(
    other: Entity,
    _: Shape,
    __: Shape,
    equations: ContactEquation[]
  ) {
    if (hasCollisionInfo(other)) {
      const { beginContactSound } = other.ballCollisionInfo;
      if (beginContactSound) {
        const impact = Math.abs(equations[0].getVelocityAlongNormal());
        const gain = clamp(impact / 50) ** 2;
        this.soundController.emitSound(beginContactSound, gain);
      }
    }
  }

  onContacting(
    other: Entity,
    _: Shape,
    __: Shape,
    equations: ContactEquation[]
  ) {
    if (hasCollisionInfo(other)) {
      const { duringContactSound } = other.ballCollisionInfo;
      if (duringContactSound) {
        const impact = Math.abs(equations[0].getVelocityAlongNormal());
        const gain = clamp(impact / 50) ** 2;
        this.soundController.emitSound(duringContactSound, gain);
      }
    }
  }
}

/** Type guard for ball entity */
export function isBall(e?: Entity): e is Ball {
  return e instanceof Ball;
}
