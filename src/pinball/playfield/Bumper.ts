import { Body, Circle } from "p2";
import { Graphics } from "pixi.js";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { clamp } from "../../core/util/MathUtil";
import { Vector } from "../../core/Vector";
import { LayerName } from "../layers";
import Light from "../lighting/Light";
import { playSoundEvent } from "../Soundboard";
import { isBall } from "./Ball";
import { CollisionGroups } from "./Collision";
import { Materials } from "./Materials";
import { colorFade, darken } from "../../core/util/ColorUtils";

const STRENGTH = 250;
const VELOCITY_MULTIPLIER = 0.2;
const EXPAND_AMOUNT = 0.35;
const ANIMATION_DURATION = 0.08;
const COLOR_1 = 0xffbb00;
const COLOR_2 = 0xdd2200;

const RESAMPLE = 4.0;

export default class Bumper extends BaseEntity implements Entity {
  lastHit: number = -Infinity;
  body: Body;

  constructor(position: Vector, size: number = 1.7) {
    super();

    this.sprites = [
      this.makeSprite(size, position, "mainfield_4", COLOR_1, COLOR_2),
      this.makeSprite(size * 0.9, position, "mainfield_3", 0x000000),
      this.makeSprite(size * 0.9, position, "mainfield_2", 0x000000),
      this.makeSprite(
        size * 0.9,
        position,
        "mainfield_1",
        darken(COLOR_1, 0.2)
      ),
    ];

    this.body = new Body({
      position: position,
      mass: 0,
    });

    const shape = new Circle({ radius: size * 0.8 });
    shape.material = Materials.bumper;
    shape.collisionGroup = CollisionGroups.Table;
    shape.collisionMask = CollisionGroups.Ball;
    this.body.addShape(shape);

    this.addChild(
      new Light({
        position: [position.x, position.y, 1.0],
        power: 1.0,
        linearFade: 0.01,
        quadraticFade: 0.05,
        color: COLOR_1,
        radius: size * 0.0,
      })
    );
  }

  makeSprite(
    size: number,
    position: Vector,
    layer: LayerName,
    c1: number,
    c2?: number
  ): GameSprite {
    const gSize = size * RESAMPLE;
    const graphics = new Graphics();
    graphics.cacheAsBitmap;
    graphics.beginFill(c1);
    graphics.drawCircle(0, 0, gSize);
    graphics.endFill();
    graphics.position.set(...position);
    if (c2 !== undefined) {
      graphics.beginFill(c2);
      graphics.drawCircle(0, 0, gSize * 0.8);
      graphics.endFill();
      graphics.beginFill(c1);
      graphics.drawCircle(0, 0, gSize * 0.6);
      graphics.endFill();
    }
    (graphics as GameSprite).layerName = layer;
    graphics.scale.set(1.0 / RESAMPLE);
    return graphics;
  }

  onRender() {
    const animationPercent =
      clamp(this.game!.elapsedTime - this.lastHit, 0, ANIMATION_DURATION) /
      ANIMATION_DURATION;
    const scale = (1 - animationPercent) * EXPAND_AMOUNT + 1;
    for (const sprite of this.sprites!.slice(1, 3)) {
      sprite.scale.set(scale / RESAMPLE);
    }
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

      // const swirlDirection = rSign();
      //   this.game!.addEntity(
      //     new ParticleSystem({
      //       position: this.body.position.clone(),
      //       count: 50,
      //       lifespan: 0.3,
      //       getColor: () => (rBool(0.7) ? COLOR_1 : COLOR_2),
      //       size: 0.5,
      //       grow: 2,
      //       swirlFriction: 4.0,
      //       friction: 0.1,
      //       getSpeed: () => rUniform(20, 50),
      //       getSwirl: () => rNormal(30 * swirlDirection, 10.0),
      //       getLife: () => rUniform(0.5, 1.0),
      //       lifeToAlpha: (life) => life ** 2 / 2.0,
      //     })
      //   );
      // }
    }
  }
}
