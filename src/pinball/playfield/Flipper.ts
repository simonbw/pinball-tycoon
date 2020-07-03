import BaseEntity from "../../core/entity/BaseEntity";
import { Graphics, DEG_TO_RAD } from "pixi.js";
import { Body, Capsule, RevoluteConstraint, RotationalSpring } from "p2";
import { Vector } from "../../core/Vector";
import Game from "../../core/Game";
import DampedRotationalSpring from "../../physics/DampedRotationalSpring";
import { degToRad } from "../../core/util/MathUtil";
import { Materials } from "../Materials";
import { CollisionGroups } from "./Collision";
import Entity from "../../core/entity/Entity";

const DOWN_ANGLE = degToRad(-30);
const UP_ANGLE = degToRad(40);
const LEFT_KEY = 88; // x
const RIGHT_KEY = 190; // .
const UP_STIFFNESS = 80000;
const DOWN_STIFFNESS = 30000;
const DAMPING = 1250;
const OVEREXTENSION_AMOUNT = degToRad(3);
const WIDTH = 1.2;

type Side = "left" | "right";

export default class Flipper extends BaseEntity implements Entity {
  joint: RevoluteConstraint;
  spring: RotationalSpring;
  downAngle: number;
  upAngle: number;
  key: number;
  side: Side;

  constructor(position: Vector, side: Side = "left", length: number = 6) {
    super();
    this.side = side;

    switch (side) {
      case "left":
        this.upAngle = UP_ANGLE;
        this.downAngle = DOWN_ANGLE;
        this.key = LEFT_KEY;
        break;
      case "right":
        this.upAngle = -1 * Math.PI - UP_ANGLE;
        this.downAngle = -1 * Math.PI - DOWN_ANGLE;
        this.key = RIGHT_KEY;
        break;
    }

    this.body = new Body({
      position: position,
      mass: 1.2,
      angle: this.downAngle + Math.PI / 2,
    });

    const shape = new Capsule({
      length: length,
      radius: WIDTH / 2,
    });
    shape.material = Materials.flipper;
    shape.collisionGroup = CollisionGroups.Table;
    shape.collisionMask = CollisionGroups.Ball;
    this.body.addShape(shape, [length / 2, 0]);

    const graphics = new Graphics();

    graphics.moveTo(0, 0);
    graphics.lineStyle(WIDTH, 0x00ffff);
    graphics.lineTo(length, 0);
    graphics.lineStyle();
    graphics.beginFill(0x00ffff);
    graphics.drawCircle(0, 0, WIDTH / 2);
    graphics.drawCircle(length, 0, WIDTH / 2);
    graphics.endFill();

    graphics.position.set(...position);
    this.sprite = graphics;
  }

  onAdd(game: Game) {
    this.joint = new RevoluteConstraint(this.body, game.ground, {
      worldPivot: this.body.position,
    });
    if (this.side === "left") {
      this.joint.setLimits(this.downAngle, this.upAngle + OVEREXTENSION_AMOUNT);
    } else {
      this.joint.setLimits(this.upAngle - OVEREXTENSION_AMOUNT, this.downAngle);
    }
    this.constraints = [this.joint];

    this.spring = new DampedRotationalSpring(this.body, game.ground, {
      stiffness: DOWN_STIFFNESS,
      damping: DAMPING,
      restAngle: this.downAngle,
    });
    this.springs = [this.spring];
  }

  onRender() {
    this.sprite.angle = this.body.angle / DEG_TO_RAD;
    this.sprite.x = this.body.position[0];
    this.sprite.y = this.body.position[1];
  }

  onTick() {
    if (this.game.io.keys[this.key]) {
      this.spring.restAngle = this.upAngle;
      this.spring.stiffness = UP_STIFFNESS;
    } else {
      this.spring.stiffness = DOWN_STIFFNESS;
      this.spring.restAngle = this.downAngle;
    }
  }
}
