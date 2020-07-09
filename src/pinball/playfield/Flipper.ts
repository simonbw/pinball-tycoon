import { Body, Capsule, RevoluteConstraint, RotationalSpring } from "p2";
import { Graphics } from "pixi.js";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import Game from "../../core/Game";
import { KeyCode } from "../../core/io/Keys";
import DampedRotationalSpring from "../../core/physics/DampedRotationalSpring";
import {
  angleDelta,
  degToRad,
  polarToVec,
  radToDeg,
  reflectX,
  reflectY,
} from "../../core/util/MathUtil";
import { Vector } from "../../core/Vector";
import { BallCollisionInfo, WithBallCollisionInfo } from "../BallCollisionInfo";
import { CollisionGroups } from "./Collision";
import { Materials } from "./Materials";

const DOWN_ANGLE = degToRad(27);
const UP_ANGLE = degToRad(-38);
const LEFT_KEY = "KeyX";
const RIGHT_KEY = "Period";
const UP_LOCK_STIFFNESS = 800000;
const UP_STIFFNESS = 80000;
const DOWN_STIFFNESS = 30000;
const DAMPING = 1250;
const OVEREXTENSION_AMOUNT = degToRad(3);
const WIDTH = 1.2;
const MASS = 2.2;

type Side = "left" | "right";

export default class Flipper extends BaseEntity
  implements Entity, WithBallCollisionInfo {
  sprite: Graphics;
  body: Body;
  joint?: RevoluteConstraint;
  spring!: RotationalSpring;
  downAngle: number;
  upAngle: number;
  key: KeyCode;
  side: Side;
  locked: boolean = false;

  ballCollisionInfo: BallCollisionInfo = {
    beginContactSound: "wallHit1",
  };

  constructor(
    position: Vector,
    side: Side = "left",
    length: number = 6,
    upAngle = UP_ANGLE,
    downAngle = DOWN_ANGLE
  ) {
    super();
    this.side = side;

    switch (side) {
      case "left":
        this.upAngle = upAngle;
        this.downAngle = downAngle;
        this.key = LEFT_KEY;
        break;
      case "right":
        this.upAngle = reflectX(upAngle) + 2 * Math.PI;
        this.downAngle = reflectX(downAngle);
        this.key = RIGHT_KEY;
        break;
    }

    this.body = new Body({
      position: position,
      mass: MASS,
      angle: this.downAngle + Math.PI / 2,
      fixedX: true,
      fixedY: true,
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
    this.joint = new RevoluteConstraint(game.ground, this.body, {
      worldPivot: this.body.position,
    });
    if (this.side === "left") {
      this.joint.setLimits(this.upAngle - OVEREXTENSION_AMOUNT, this.downAngle);
    } else {
      this.joint.setLimits(this.downAngle, this.upAngle + OVEREXTENSION_AMOUNT);
    }
    this.constraints = [this.joint];

    this.spring = new DampedRotationalSpring(game.ground, this.body, {
      stiffness: DOWN_STIFFNESS,
      damping: DAMPING,
      restAngle: this.downAngle,
    });
    this.springs = [this.spring];
  }

  onRender() {
    const p = this.body.position;
    const up = polarToVec(this.upAngle, 6.0);
    const down = polarToVec(this.downAngle, 6.0);

    this.sprite.angle = radToDeg(this.body.angle);
    this.sprite.x = this.body.position[0];
    this.sprite.y = this.body.position[1];

    this.sprite.tint = this.locked ? 0x888888 : 0xffffff;
  }

  shouldLock() {
    const angle = this.body.angle;
    const targetAngle = this.spring.restAngle;
    const speed = Math.abs(this.body.angularVelocity);
    const offset = Math.abs(angleDelta(angle, targetAngle));
    return offset < 0.05 && speed < 0.5;
  }

  lock() {
    this.locked = true;
    this.body.type = Body.STATIC;
    this.body.angularVelocity = 0;
    this.body.updateMassProperties();
  }

  unlock() {
    this.locked = false;
    this.body.type = Body.DYNAMIC;
    this.body.mass = MASS;
    this.body.updateMassProperties();
  }

  onTick() {
    const engaged = this.game!.io.keyIsDown(this.key);

    this.spring.restAngle = engaged ? this.upAngle : this.downAngle;
    this.spring.stiffness = engaged ? UP_STIFFNESS : DOWN_STIFFNESS;

    const shouldLock = this.shouldLock();
    if (!this.locked && shouldLock) {
      this.lock();
    } else if (this.locked && !shouldLock) {
      this.unlock();
    }
  }
}
