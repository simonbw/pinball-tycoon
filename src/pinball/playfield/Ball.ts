import { Body, Circle, ContactEquation, Shape } from "p2";
import {
  CubeCamera,
  Material,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  SphereGeometry,
  WebGLCubeRenderTarget,
} from "three";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import CCDBody from "../../core/physics/CCDBody";
import { SoundName } from "../../core/resources/sounds";
import { clamp, degToRad } from "../../core/util/MathUtil";
import { V, Vector } from "../../core/Vector";
import { hasCollisionInfo, SparkInfo } from "../BallCollisionInfo";
import { NudgeEvent } from "../controllers/NudgeController";
import ParticleSystem from "../effects/ParticleSystem";
import { makeSparkParams } from "../effects/Sparks";
import { TEXTURES } from "../graphics/textures";
import { playSoundEvent } from "../Soundboard";
import { CollisionGroups } from "./Collision";
import { Materials } from "./Materials";

const RADIUS = 1.0625; // Radius in half inches
const MASS = 2.8; // In ounces
const FRICTION = 0.005; // rolling friction
const TABLE_ANGLE = degToRad(7); // amount of tilt in the table
const GRAVITY = 386.0 * Math.sin(TABLE_ANGLE); // inches/s^2

const GEOMETRY = new SphereGeometry(RADIUS, 32, 32);

export default class Ball extends BaseEntity implements Entity {
  tags = ["ball"];
  body: Body;
  radius: number = RADIUS;
  mesh: Mesh;
  material: Material;
  cubeCamera: CubeCamera;
  object3ds: Object3D[] = [];

  rollingVelocity: Vector = V(0, 0);
  rollingPosition: Vector = V(0, 0);

  constructor(position: Vector, velocity: Vector = V(0, 0)) {
    super();

    this.body = this.makeBody();
    this.body.position = position;
    this.body.velocity = velocity;

    const renderTarget = new WebGLCubeRenderTarget(32);
    this.cubeCamera = new CubeCamera(0.1, 10, renderTarget);

    this.object3ds.push(this.cubeCamera);

    this.material = new MeshStandardMaterial({
      color: 0xdddddd,
      roughness: 1.2,
      metalness: 0.8,
      roughnessMap: TEXTURES.IronScuffedRoughness,
      envMap: renderTarget.texture,
    });

    this.mesh = new Mesh(GEOMETRY, this.material);
    this.mesh.castShadow = true;
  }

  makeBody() {
    const body = new CCDBody({
      mass: MASS,
      ccdSpeedThreshold: 0,
      ccdIterations: 15,
    });

    const shape = new Circle({ radius: this.radius });
    shape.material = Materials.ball;
    shape.collisionGroup = CollisionGroups.Ball;
    shape.collisionMask = CollisionGroups.Ball | CollisionGroups.Table;
    body.addShape(shape);
    return body;
  }

  /** The visual height of the center of the ball above the playfield */
  getZ(): number {
    return this.radius;
  }

  onTick() {
    // Gravity
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

  onRender() {
    const { threeRenderer, scene } = this.game!.renderer;
    const [x, y] = this.body.position;
    const z = this.radius;
    this.mesh.position.set(x, y, -z);
    this.cubeCamera.position.copy(this.mesh.position);
    this.cubeCamera.update(threeRenderer, scene);
  }

  onDestroy() {
    this.material.dispose();
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
