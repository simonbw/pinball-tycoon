import { Body, Box, ContactEquation, LinearSpring, Shape, Spring } from "p2";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { clamp } from "../../core/util/MathUtil";
import { Vector } from "../../core/Vector";
import { playSoundEvent } from "../Soundboard";
import { isBall } from "./Ball";
import { CollisionGroups } from "./Collision";
import { Materials } from "./Materials";

const WIDTH = 2;
const HEIGHT = 1.5;
const LENGTH = 3.2;
const STIFFNESS = 40000;
const DAMPING = 30;
const PULL_SPEED = 32; // arbitrary units
const MAX_PULL_DISTANCE = 3.2; // inches
const PULL_KEY = "Enter";

export default class Plunger extends BaseEntity implements Entity {
  body: Body;
  neutralPosition: Vector;
  private pullSpring?: Spring;

  constructor(position: Vector) {
    super();
    this.neutralPosition = position;

    this.body = new Body({
      position: position,
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
    const spring = new LinearSpring(this.body, this.game!.ground, {
      damping: DAMPING,
      stiffness: STIFFNESS,
    });
    this.pullSpring = new LinearSpring(this.body, this.game!.ground, {
      stiffness: 0,
      worldAnchorB: this.neutralPosition.add([0, MAX_PULL_DISTANCE * 1.5]),
      restLength: 0.1,
    });

    this.springs = [spring, this.pullSpring];
  }

  onTick() {
    if (this.game!.io.keyIsDown(PULL_KEY)) {
      if (this.body.position[1] - this.neutralPosition[1] < MAX_PULL_DISTANCE) {
        this.pullSpring!.stiffness += PULL_SPEED;
      }
    } else {
      this.pullSpring!.stiffness = 0;
    }
  }

  onRender() {
    const [x, y] = this.body.position;
    // graphics.clear();
    // graphics.beginFill(0x666666);
    // graphics.drawRect(x - 0.4, y, 0.8, LENGTH);
    // graphics.endFill();
    // graphics.beginFill(0x000000);
    // graphics.drawRect(x - WIDTH / 2, y - HEIGHT / 2, WIDTH, HEIGHT);
    // graphics.endFill();
  }

  onBeginContact(
    ball: Entity,
    _: Shape,
    __: Shape,
    contactEquations: ContactEquation[]
  ) {
    if (isBall(ball)) {
      const eq = contactEquations[0];
      const impact = Math.abs(eq.getVelocityAlongNormal());
      const pan = clamp(ball.getPosition()[0] / 40, -0.5, 0.5);
      const gain = clamp(impact / 50) ** 1.2;
      this.game!.dispatch(playSoundEvent("plungerHit", { pan, gain }));
    }
  }
}
