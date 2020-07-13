import { Body, Circle, ContactEquation, Shape } from "p2";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import CCDBody from "../../core/physics/CCDBody";
import { SoundName } from "../../core/resources/sounds";
import { clamp, degToRad } from "../../core/util/MathUtil";
import { V, Vector } from "../../core/Vector";
import { NudgeEvent } from "../controllers/NudgeController";
import ParticleSystem from "../effects/ParticleSystem";
import { makeSparkParams } from "../effects/Sparks";
import { CollisionGroups } from "../playfield/Collision";
import { P2Materials } from "../playfield/Materials";
import { playSoundEvent } from "../Soundboard";
import { hasCollisionInfo, SparkInfo } from "./BallCollisionInfo";
import PuckMesh from "./PuckMesh";

const RADIUS = 1.0625; // Radius in half inches
const MASS = 2.8; // In ounces
const FRICTION = 0.005; // rolling friction
const TABLE_ANGLE = degToRad(7); // amount of tilt in the table
const GRAVITY = 386.0 * Math.sin(TABLE_ANGLE); // inches/s^2

export default class Ball extends BaseEntity implements Entity {
  tags = ["ball"];
  body: Body;
  radius: number = RADIUS;
  captured: boolean = false;
  rollingVelocity: Vector = V(0, 0);
  rollingPosition: Vector = V(0, 0);

  constructor(position: Vector, velocity: Vector = V(0, 0)) {
    super();

    this.body = new CCDBody({
      mass: MASS,
      ccdSpeedThreshold: 0,
      ccdIterations: 15,
    });
    this.body.position = position;
    this.body.velocity = velocity;

    const shape = new Circle({ radius: this.radius });
    shape.material = P2Materials.ball;
    shape.collisionGroup = CollisionGroups.Ball;
    shape.collisionMask = CollisionGroups.Ball | CollisionGroups.Table;
    this.body.addShape(shape);

    // this.addChild(new BallMesh(this));
    this.addChild(new PuckMesh(this));
  }

  /** The visual height of the center of the ball above the playfield */
  getZ(): number {
    if (this.captured) {
      return -this.radius / 3;
    }
    return this.radius;
  }

  onTick() {
    // Gravity
    if (!this.captured) {
      this.body.applyForce([0, GRAVITY * MASS]);

      // Spin
      const spinForce = V(this.body.velocity)
        .normalize()
        .irotate90cw()
        .imul(this.body.angularVelocity * 0.05);
      this.body.applyForce(spinForce);

      // Friction
      const frictionForce = V(this.body.velocity).mul(-FRICTION);
      this.body.applyForce(frictionForce);

      this.rollingVelocity.set(this.body.velocity);
      this.rollingPosition.iadd(this.rollingVelocity);
    }
  }

  // Ball gets controlled by other entity
  capture() {
    this.captured = true;
    this.body.collisionResponse = false;
    this.body.velocity[0] = 0;
    this.body.velocity[1] = 0;
    this.body.angularVelocity = 0;
    this.rollingVelocity.set([0, 0]);
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
      const { sparkInfo, beginContactSound } = other.ballCollisionInfo;
      if (beginContactSound) {
        const impact = Math.abs(equations[0].getVelocityAlongNormal());
        const gain = clamp(impact / 50) ** 2;
        this.emitSound(beginContactSound, gain);
      }
      if (sparkInfo && sparkInfo.maxBegin) {
        this.spark(
          equations[0],
          sparkInfo.minBegin || 0,
          sparkInfo.maxBegin,
          sparkInfo
        );
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
      const { sparkInfo, duringContactSound } = other.ballCollisionInfo;
      if (duringContactSound) {
        const impact = Math.abs(equations[0].getVelocityAlongNormal());
        const gain = clamp(impact / 50) ** 2;
        this.emitSound(duringContactSound, gain);
      }
      if (sparkInfo && sparkInfo.maxDuring) {
        this.spark(
          equations[0],
          sparkInfo.minDuring || 0,
          sparkInfo.maxDuring,
          sparkInfo
        );
      }
    }
  }

  emitSound(soundName: SoundName, gain: number = 1.0) {
    const pan = clamp(this.getPosition()[0] / 40, -0.5, 0.5);
    this.game!.dispatch(playSoundEvent(soundName, { pan, gain }));
  }

  spark(
    eq: ContactEquation,
    min: number,
    max: number,
    { color, size, impactMultiplier = 1.0 }: SparkInfo
  ) {
    if (eq.bodyA && eq.bodyB) {
      const impact =
        impactMultiplier *
        (Math.abs(eq.getVelocityAlongNormal()) +
          Math.abs(eq.relativeVelocity) * 0.0);
      const count = Math.floor(
        (max - min) * clamp(impact ** 1.1 / 100.0, 0, 1.0) + min
      );
      if (count > 0) {
        const isA = this.body === eq.bodyA;
        const contactPos = V(isA ? eq.contactPointA : eq.contactPointB);
        const position = this.getPosition().add(contactPos);
        const direction = contactPos.angle + Math.PI;
        const ballSpin = this.body.angularVelocity;
        this.game!.addEntity(
          new ParticleSystem({
            ...makeSparkParams({ direction, impact, ballSpin, size }),
            position,
            count,
            color,
          })
        );
      }
    }
  }
}

/** Type guard for ball entity */
export function isBall(e?: Entity): e is Ball {
  return e instanceof Ball;
}
