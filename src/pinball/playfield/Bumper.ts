import { Body, Circle } from "p2";
import { Graphics } from "pixi.js";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { clamp } from "../../core/util/MathUtil";
import { Vector } from "../../core/Vector";
import { Materials } from "./Materials";
import { isBall } from "./Ball";
import { CollisionGroups } from "./Collision";
import { playSoundEvent } from "../Soundboard";
import { LayerName } from "../../core/graphics/Layers";
import Light from "../lighting/Light";

const STRENGTH = 250;
const VELOCITY_MULTIPLIER = 0.2;
const EXPAND_AMOUNT = 0.15;
const ANIMATION_DURATION = 0.1;

const RESAMPLE = 4.0;

export default class Bumper extends BaseEntity implements Entity {
  layer: LayerName = "world_front";
  lastHit: number = -Infinity;

  constructor(position: Vector, size: number = 1.7) {
    super();
    const graphics = new Graphics();

    const color1 = 0xffbb00;
    const color2 = 0xdd2200;

    const gSize = size * RESAMPLE;
    graphics.beginFill(color1);
    graphics.drawCircle(0, 0, gSize);
    graphics.endFill();
    graphics.beginFill(color2);
    graphics.drawCircle(0, 0, gSize * 0.8);
    graphics.endFill();
    graphics.beginFill(color1);
    graphics.drawCircle(0, 0, gSize * 0.6);
    graphics.endFill();

    graphics.position.set(...position);
    this.sprite = graphics;

    this.body = new Body({
      position: position,
      mass: 0,
    });

    const shape = new Circle({ radius: size * 0.8 });
    shape.material = Materials.bumper;
    shape.collisionGroup = CollisionGroups.Table;
    shape.collisionMask = CollisionGroups.Ball;
    this.body.addShape(shape);

    this.children = [
      new Light({
        position: [position.x, position.y, 1.0],
        power: 1.0,
        linearFade: 0.01,
        quadraticFade: 0.05,
        color: color1,
        radius: size * 0.0,
      }),
    ];
  }

  onRender() {
    const animationPercent =
      clamp(this.game!.elapsedTime - this.lastHit, 0, ANIMATION_DURATION) /
      ANIMATION_DURATION;
    const scale = (1 - animationPercent) * EXPAND_AMOUNT + 1;
    this.sprite!.scale.set(scale / RESAMPLE);
  }

  onImpact(ball: Entity) {
    if (isBall(ball)) {
      this.game!.dispatch({ type: "score", points: 70 });
      const pan = clamp(this.getPosition()[0] / 30, -0.5, 0.5);
      this.game!.dispatch(playSoundEvent("pop1", { pan }));

      ball.body.velocity[0] *= VELOCITY_MULTIPLIER;
      ball.body.velocity[1] *= VELOCITY_MULTIPLIER;
      const impulse = this.getPosition()
        .sub(ball.getPosition())
        .inormalize()
        .mul(-STRENGTH);
      ball.body.applyImpulse(impulse);

      this.lastHit = this.game!.elapsedTime;
    }
  }
}
