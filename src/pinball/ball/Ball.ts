import { Body, Circle, ContactEquation, Shape } from "p2";
import { Vector3 } from "three";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import CCDBody from "../../core/physics/CCDBody";
import { clamp, degToRad } from "../../core/util/MathUtil";
import { V, V2d } from "../../core/Vector";
import { CollisionGroups } from "../Collision";
import { NudgeEvent } from "../controllers/NudgeController";
import { P2Materials } from "../playfield/P2Materials";
import Table from "../tables/Table";
import {
  BallCollisionInfo,
  getNameFromSoundInfo,
  hasCollisionInfo,
  WithBallCollisionInfo,
} from "./BallCollisionInfo";
import BallMesh from "./BallMesh";
import BallSoundController from "./BallSoundController";

const RADIUS = 1.0625; // Radius in 1/2 inches
const FRICTION = 0.008; // rolling friction
const GRAVITY = 2.0 * 386.0; // 1/2 inches/s^2

export default class Ball extends BaseEntity
  implements Entity, WithBallCollisionInfo {
  tags = ["ball"];
  body: Body;
  radius: number = RADIUS;
  captured: boolean = false;
  angularMomentum: Vector3 = new Vector3();
  soundController: BallSoundController;
  ballCollisionInfo: BallCollisionInfo = {
    beginContactSound: { names: ["ballOnBall1", "ballOnBall2"] },
  };
  z: number; // Height above the table
  vz: number = 0;

  constructor(position: V2d, z: number = 1, velocity: V2d = V(0, 0)) {
    super();

    this.z = z;

    this.body = new CCDBody({
      mass: 2.8,
      ccdSpeedThreshold: RADIUS * 20 * 60, // moving approximately half its width per tick
      ccdIterations: 5,
      position: position.clone(),
      velocity: velocity.clone(),
    });

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
    return this.z;
  }

  getPosition3() {
    const [x, y] = this.getPosition();
    const z = -(this.z + this.radius);
    return new Vector3(x, y, z);
  }

  getTable(): Table | undefined {
    if (this.parent instanceof Table) {
      return this.parent;
    }
    return undefined;
  }

  getIncline() {
    return this.getTable()?.getIncline(this.body.position) ?? 0;
  }

  onTick(dt: number) {
    // Gravity
    if (!this.captured) {
      // Even in the air horizontal gravity applies
      const yGravity = GRAVITY * Math.sin(this.getIncline());
      this.body.applyForce([0, yGravity * this.body.mass]);

      // We're in the air, or going up
      if (this.z > 0 || this.vz > 0) {
        const zGravity = -GRAVITY * Math.cos(this.getIncline());
        this.vz += zGravity * dt;
        this.z += this.vz * dt;

        // We hit the ground
        if (this.z <= 0) {
          const gain = clamp(Math.abs(this.vz) * 0.2) * 0.5;
          this.soundController.emitCollisionSound({ name: "ballDrop1" }, gain);
          if (this.vz < -50) {
            this.vz *= -0.35;
          } else {
            this.vz = 0;
          }
          this.z = 0;
        }
      } else {
        // We're on the ground

        // Spin
        const spinForce = V(this.body.velocity)
          .inormalize()
          .irotate90cw()
          .imul(this.body.angularVelocity * 0.005);
        this.body.applyForce(spinForce);

        // Friction
        const frictionForce = V(this.body.velocity).imul(-FRICTION);
        this.body.applyForce(frictionForce);

        // TODO: Better angular momentum
        const n2d = V(this.body.velocity).rotate90cw().imul(RADIUS);
        this.angularMomentum.set(n2d.x, n2d.y, 0);
      }
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
        this.soundController.emitCollisionSound(beginContactSound, gain);
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
        this.soundController.emitCollisionSound(duringContactSound, gain);
      }
    }
  }
}

/** Type guard for ball entity */
export function isBall(e?: Entity): e is Ball {
  return e instanceof Ball;
}
