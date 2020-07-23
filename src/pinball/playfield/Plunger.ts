import { Body, Box, LinearSpring, Spring } from "p2";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { ControllerButton } from "../../core/io/Gamepad";
import { clamp } from "../../core/util/MathUtil";
import { V2d } from "../../core/Vector";
import {
  BallCollisionInfo,
  WithBallCollisionInfo,
} from "../ball/BallCollisionInfo";
import { CollisionGroups } from "../Collision";
import { PositionalSound } from "../sound/PositionalSound";
import { getBinding } from "../ui/KeyboardBindings";
import { P2Materials } from "./P2Materials";
import PlungerMesh from "./PlungerMesh";

const WIDTH = 2;
const HEIGHT = 1.5;
const STIFFNESS = 40000;
const DAMPING = 30;
const PULL_SPEED = 28; // arbitrary units
const MAX_PULL_DISTANCE = 3.2; // inches

export default class Plunger extends BaseEntity
  implements Entity, WithBallCollisionInfo {
  tags = ["plunger"];
  body: Body;
  neutralPosition: V2d;
  private pullSpring?: Spring;
  ballCollisionInfo: BallCollisionInfo = {
    beginContactSound: { name: "plungerHit" },
  };
  plunging: boolean = false;

  constructor(position: V2d, width: number = WIDTH) {
    super();
    this.neutralPosition = position;

    this.body = new Body({
      position: position,
      mass: 3,
      fixedRotation: true,
      fixedX: true,
    });

    const shape = new Box({ width: WIDTH, height: HEIGHT });
    shape.material = P2Materials.plunger;
    shape.collisionGroup = CollisionGroups.Table;
    shape.collisionMask = CollisionGroups.Ball;
    this.body.addShape(shape);

    this.addChild(new PlungerMesh(this));
  }

  getPercentDown() {
    return (
      Math.abs(this.body.position[1] - this.neutralPosition.y) /
      MAX_PULL_DISTANCE
    );
  }

  onAdd() {
    const ground = this.game!.ground;
    const spring = new LinearSpring(this.body, ground, {
      damping: DAMPING,
      stiffness: STIFFNESS,
    });
    this.pullSpring = new LinearSpring(this.body, ground, {
      stiffness: 0,
      worldAnchorB: this.neutralPosition.add([0, MAX_PULL_DISTANCE * 1.5]),
      restLength: 0.1,
    });

    this.springs = [spring, this.pullSpring];
  }

  onTick() {
    if (this.plunging) {
      if (!this.shouldPlunge()) {
        this.endPlunge();
      }
      const dy = this.body.position[1] - this.neutralPosition[1];
      if (dy < MAX_PULL_DISTANCE) {
        this.pullSpring!.stiffness += PULL_SPEED;
      } else {
        this.stopWindSound();
      }
    } else {
      this.pullSpring!.stiffness = 0;
      if (this.shouldPlunge()) {
        this.startPlunge();
      }
    }
  }

  shouldPlunge() {
    return (
      this.game!.io.keyIsDown(getBinding("PLUNGE")) ||
      this.game!.io.getButton(ControllerButton.B) > 0.1
    );
  }

  startPlunge() {
    this.plunging = true;
    const pan = clamp(this.body.position[0] / 40, -0.6, 0.6);
    this.addChild(new PositionalSound("plungerWind", this.getPosition()));
  }

  endPlunge() {
    this.plunging = false;
    this.stopWindSound();
    const gain = this.getPercentDown() ** 1.5;
    this.addChild(new PositionalSound("boing2", this.getPosition(), { gain }));
  }

  stopWindSound() {
    for (const child of this.children) {
      if (
        child instanceof PositionalSound &&
        child.soundName === "plungerWind"
      ) {
        child.destroy();
      }
    }
  }
}

export function isPlunger(e?: Entity): e is Plunger {
  return e instanceof Plunger;
}
