import BaseEntity from "../../core/entity/BaseEntity";
import { Graphics, DEG_TO_RAD } from "pixi.js";
import { Body, Circle } from "p2";
import { Vector, V } from "../../core/Vector";
import { Materials } from "../Materials";
import { CollisionGroups } from "./Collision";
import CCDBody from "../../core/physics/CCDBody";
import { degToRad } from "../../core/util/MathUtil";
import Entity from "../../core/entity/Entity";

const RADIUS = 1.0625; // Radius in inches
const MASS = 2.8; // In ounces
const FRICTION = 0.005; // rolling friction
const TABLE_ANGLE = degToRad(7); // amount of tilt in the table
const GRAVITY = 386.0 * Math.sin(TABLE_ANGLE); // inches/s^2

export default class Ball extends BaseEntity implements Entity {
  tags = ["ball"];
  body: Body;
  sprite: Graphics;

  constructor(position: Vector, velocity: Vector = V([0, 0])) {
    super();

    this.sprite = this.makeSprite();
    this.body = this.makeBody();
    this.body.position = position;
    this.body.velocity = velocity;
  }

  makeSprite() {
    const graphics = new Graphics();
    graphics.beginFill(0xaaaaaa);
    graphics.drawCircle(0, 0, RADIUS);
    graphics.endFill();
    graphics.lineStyle(0.1, 0xffffff, 0.2);
    graphics.lineTo(0, RADIUS * 0.8);
    graphics.moveTo(0, 0);
    graphics.lineTo(0, -RADIUS * 0.8);
    graphics.moveTo(0, 0);
    graphics.lineTo(RADIUS * 0.8, 0);
    graphics.moveTo(0, 0);
    graphics.lineTo(-RADIUS * 0.8, 0);
    return graphics;
  }

  makeBody() {
    const body = new CCDBody({
      mass: MASS,
      ccdSpeedThreshold: 0,
      ccdIterations: 15,
    });

    const shape = new Circle({ radius: RADIUS });
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
    this.sprite.angle = this.body.angle / DEG_TO_RAD;
  }
}

/** Type guard for ball entity */
export function isBall(e?: Entity): e is Ball {
  return Boolean(e && e.tags && e.tags.indexOf("ball") >= 0);
}
