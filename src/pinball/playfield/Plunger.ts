import BaseEntity from "../../core/entity/BaseEntity";
import { Graphics } from "pixi.js";
import { Body, Capsule, Box, Spring, LinearSpring } from "p2";
import { Vector, V } from "../../core/Vector";
import { Materials } from "../Materials";
import { CollisionGroups } from "./Collision";
import Ball from "./Ball";
import { clamp } from "../../core/util/MathUtil";
import Game from "../../core/Game";
import Entity from "../../core/entity/Entity";

const WIDTH = 2;
const HEIGHT = 1.5;
const LENGTH = 3.2;
const STIFFNESS = 40000;
const DAMPING = 30;
const PULL_SPEED = 32; // arbitrary units
const MAX_PULL_DISTANCE = 3.2; // inches

export default class Plunger extends BaseEntity implements Entity {
  private spring: Spring;
  private pullSpring: Spring;
  neutralPosition: Vector;

  constructor(position: Vector) {
    super();
    this.sprite = new Graphics();
    this.neutralPosition = position;

    this.body = new Body({
      position,
      mass: 3,
      fixedRotation: true,
      fixedX: true,
    });

    const shape = new Box({ width: WIDTH, height: HEIGHT });
    shape.material = Materials.plunger;
    shape.collisionGroup = CollisionGroups.Table;
    shape.collisionMask = CollisionGroups.Ball;
    this.body.addShape(shape);
  }

  onAdd() {
    this.spring = new LinearSpring(this.body, this.game.ground, {
      damping: DAMPING,
      stiffness: STIFFNESS,
    });
    this.pullSpring = new LinearSpring(this.body, this.game.ground, {
      stiffness: 0,
      worldAnchorB: this.neutralPosition.add(V([0, MAX_PULL_DISTANCE * 1.5])),
      restLength: 0.1,
    });

    this.springs = [this.spring, this.pullSpring];
  }

  onTick() {
    if (this.game.io.keys[13]) {
      if (this.body.position[1] - this.neutralPosition[1] < MAX_PULL_DISTANCE) {
        this.pullSpring.stiffness += PULL_SPEED;
      }
    } else {
      this.pullSpring.stiffness = 0;
    }
  }

  onRender() {
    const [x, y] = this.body.position;
    const graphics = this.sprite as Graphics;
    graphics.clear();
    graphics.beginFill(0x666666);
    graphics.drawRect(x - 0.4, y, 0.8, LENGTH);
    graphics.endFill();
    graphics.beginFill(0x000000);
    graphics.drawRect(x - WIDTH / 2, y - HEIGHT / 2, WIDTH, HEIGHT);
    graphics.endFill();
  }

  onImpact(ball: Ball) {}
}
