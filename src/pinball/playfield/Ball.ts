import { Body, Circle } from "p2";
import { Filter, Graphics } from "pixi.js";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import CCDBody from "../../core/physics/CCDBody";
import { degToRad } from "../../core/util/MathUtil";
import { V, Vector } from "../../core/Vector";
import { NudgeEvent } from "../controllers/NudgeController";
import BallShader from "../effects/BallShader.frag";
import BallShadow from "../effects/BallShadow";
import { makeShaderFilter } from "../effects/ShaderFilter";
import { CollisionGroups } from "./Collision";
import { Materials } from "./Materials";

const RADIUS = 1.0625; // Radius in inches
const MASS = 2.8; // In ounces
const FRICTION = 0.005; // rolling friction
const TABLE_ANGLE = degToRad(7); // amount of tilt in the table
const GRAVITY = 386.0 * Math.sin(TABLE_ANGLE); // inches/s^2
const RESAMPLE = 3.0;

export default class Ball extends BaseEntity implements Entity {
  tags = ["ball"];
  body: Body;
  sprite: Graphics;
  ballShader: Filter = makeShaderFilter(BallShader);
  radius: number = RADIUS;

  constructor(position: Vector, velocity: Vector = V([0, 0])) {
    super();

    this.sprite = this.makeSprite();
    this.body = this.makeBody();
    this.body.position = position;
    this.body.velocity = velocity;
    // this.addChild(new BallShadow(this));
  }

  makeSprite() {
    const r = this.radius * RESAMPLE;
    const graphics = new Graphics();
    graphics.beginFill(0xffffff);
    graphics.drawCircle(0, 0, r);
    graphics.endFill();
    graphics.filters = [this.ballShader];
    graphics.scale.set(1 / RESAMPLE);
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
    return V(this.body.velocity);
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
  }

  onRender() {
    this.sprite.x = this.body.position[0];
    this.sprite.y = this.body.position[1];
    const vLightDirection = V([0, 20]).sub(this.getPosition());
    this.ballShader.uniforms.vLightDirection = [...vLightDirection, 30];
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
}

/** Type guard for ball entity */
export function isBall(e?: Entity): e is Ball {
  return Boolean(e && e.tags && e.tags.indexOf("ball") >= 0);
}
