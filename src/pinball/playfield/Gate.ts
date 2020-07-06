import { Body, Capsule, RevoluteConstraint, Shape, ContactEquation } from "p2";
import { Graphics } from "pixi.js";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import Game from "../../core/Game";
import { Vector } from "../../core/Vector";
import DampedRotationalSpring from "../../core/physics/DampedRotationalSpring";
import { Materials } from "./Materials";
import { CollisionGroups } from "./Collision";
import { degToRad, radToDeg, clamp } from "../../core/util/MathUtil";
import { isBall } from "./Ball";
import { playSoundEvent } from "../Soundboard";

export default class Gate extends BaseEntity implements Entity {
  body: Body;
  sprite: Graphics;
  pivot: Vector;
  swingAmount: number;

  constructor(
    pivot: Vector,
    end: Vector,
    swingAmount: number = Math.PI,
    width: number = 0.5,
    color: number = 0xaaaaaa
  ) {
    super();
    this.pivot = pivot;
    this.swingAmount = swingAmount;

    const delta = end.sub(pivot);

    this.sprite = new Graphics();
    this.sprite.moveTo(0, 0);
    this.sprite.lineStyle(width, color);
    this.sprite.lineTo(delta.x, delta.y);
    this.sprite.lineStyle();
    this.sprite.beginFill(color);
    this.sprite.drawCircle(0, 0, width / 2);
    this.sprite.drawCircle(delta.x, delta.y, width / 2);
    this.sprite.endFill();
    this.sprite.pivot.set(...delta.mul(0.5));

    this.body = new Body({
      position: pivot.add(delta.mul(0.5)),
      mass: 0.18,
    });

    const shape = new Capsule({
      length: delta.magnitude,
      radius: width / 2,
    });
    shape.material = Materials.wall;
    shape.collisionGroup = CollisionGroups.Table;
    shape.collisionMask = CollisionGroups.Ball;
    this.body.addShape(shape, [0, 0], delta.angle);
  }

  onAdd(game: Game) {
    const hinge = new RevoluteConstraint(this.body, game.ground, {
      worldPivot: this.pivot,
    });
    if (this.swingAmount > 0) {
      hinge.setLimits(0, this.swingAmount);
    } else {
      hinge.setLimits(this.swingAmount, 0);
    }
    hinge.lowerLimitEnabled = true;
    hinge.upperLimitEnabled = true;
    this.constraints = [hinge];

    const spring = new DampedRotationalSpring(this.body, game.ground, {
      stiffness: 80,
      damping: 3,
    });
    this.springs = [spring];
  }

  onRender() {
    this.sprite.angle = radToDeg(this.body.angle);
    this.sprite.position.set(...this.body.position);
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
      const gain = clamp(impact / 50) ** 2;
      this.game!.dispatch(playSoundEvent("gateHit", { pan, gain }));
    }
  }
}
