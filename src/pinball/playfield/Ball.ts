import { Body, Circle, ContactEquation, Shape } from "p2";
import { Filter, Graphics } from "pixi.js";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { LayerName } from "../../core/graphics/Layers";
import CCDBody from "../../core/physics/CCDBody";
import { SoundName } from "../../core/resources/sounds";
import { hexToVec3 } from "../../core/util/ColorUtils";
import { clamp, degToRad } from "../../core/util/MathUtil";
import { Vector } from "../../core/Vector";
import { hasCollisionInfo, SparkInfo } from "../BallCollisionInfo";
import { NudgeEvent } from "../controllers/NudgeController";
import BallShader from "../effects/BallShader.frag";
import ParticleSystem from "../effects/ParticleSystem";
import { makeShaderFilter } from "../effects/ShaderFilter";
import { makeSparkParams } from "../effects/Sparks";
import {
  getLightUniformsForPoint,
  LightUniforms,
} from "../lighting/LightUniforms";
import { playSoundEvent } from "../Soundboard";
import { CollisionGroups } from "./Collision";
import { Materials } from "./Materials";

const RADIUS = 1.0625; // Radius in inches
const MASS = 2.8; // In ounces
const FRICTION = 0.005; // rolling friction
const TABLE_ANGLE = degToRad(7); // amount of tilt in the table
const GRAVITY = 386.0 * Math.sin(TABLE_ANGLE); // inches/s^2
const RESAMPLE = 1.0;

const DIFFUSE_COLOR = 0x999999;
const SPECULAR_COLOR = 0x999999;
const AMBIENT_COLOR = 0x333333;
const SHININESS = 14.0;

export default class Ball extends BaseEntity implements Entity {
  tags = ["ball"];
  layer: LayerName = "ball";
  body: Body;
  sprite: Graphics;
  ballShader: Filter = makeShaderFilter(BallShader);
  radius: number = RADIUS;

  rollingVelocity: Vector = [0, 0];
  rollingPosition: Vector = [0, 0];

  constructor(position: Vector, velocity: Vector = [0, 0]) {
    super();

    this.sprite = this.makeSprite();
    this.body = this.makeBody();
    this.body.position = position;
    this.body.velocity = velocity;
  }

  makeSprite() {
    const ballUniforms = this.ballShader.uniforms as BallShaderUniforms;
    ballUniforms.fMaterialShininess = SHININESS;
    ballUniforms.vMaterialDiffuseColor = hexToVec3(DIFFUSE_COLOR);
    ballUniforms.vMaterialSpecularColor = hexToVec3(SPECULAR_COLOR);
    ballUniforms.vAmbientLightColor = hexToVec3(AMBIENT_COLOR);

    const r = this.radius * RESAMPLE;
    const graphics = new Graphics();
    graphics.beginFill(0xffffff);
    graphics.drawRect(-r, -r, 2 * r, 2 * r);
    graphics.endFill();
    graphics.filters = [this.ballShader];
    graphics.scale.set(1.0 / RESAMPLE);

    return graphics;
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

  getVelocity(): Vector {
    return this.body.velocity;
  }

  onTick() {
    // Gravity
    this.body.applyForce([0, GRAVITY * MASS]);

    // Spin
    const spinForce = this.body.velocity
      .normalize()
      .irotate90cw()
      .imul(this.body.angularVelocity * 0.05);
    this.body.applyForce(spinForce);

    // Friction
    const frictionForce = this.body.velocity.mul(-FRICTION);
    this.body.applyForce(frictionForce);

    this.rollingVelocity.set(this.body.velocity);
    this.rollingPosition.iadd(this.rollingVelocity);
  }

  onRender() {
    const [x, y] = this.body.position;
    this.sprite.position.set(x, y);
    const vLightDirection = [0, 20].sub(this.getPosition());
    this.ballShader.uniforms.vLightDirection = [...vLightDirection, 30];

    const r = this.radius;
    const lightUniforms = getLightUniformsForPoint(this.game!, [x, y, r], r, r);
    const ballUniforms = this.ballShader.uniforms as BallShaderUniforms;
    ballUniforms.vLightPosition = lightUniforms.vLightPosition;
    ballUniforms.vLightColor = lightUniforms.vLightColor;
    ballUniforms.fLightPower = lightUniforms.fLightPower;
    ballUniforms.fLightLinearFade = lightUniforms.fLightLinearFade;
    ballUniforms.fLightQuadraticFade = lightUniforms.fLightQuadraticFade;
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
        const contactPos = isA ? eq.contactPointA : eq.contactPointB;
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
  // return Boolean(e && e.tags && e.tags.indexOf("ball") >= 0);
}

interface BallShaderUniforms extends LightUniforms {
  vAmbientLightColor: [number, number, number];
  vMaterialDiffuseColor: [number, number, number];
  vMaterialSpecularColor: [number, number, number];
  fMaterialShininess: number;
}
