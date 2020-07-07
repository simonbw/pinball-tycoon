import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import Ball from "../playfield/Ball";
import { Graphics, Filter } from "pixi.js";
import { LayerName } from "../../core/graphics/Layers";
import BallShadowShader from "./BallShadowShader.frag";
import { makeShaderFilter } from "./ShaderFilter";
import { degToRad, mod, normalizeRad } from "../../core/util/MathUtil";

const RESAMPLE = 3.0;
const SKEW_AMOUNT = 0.1;

export default class BallShadow extends BaseEntity implements Entity {
  layer: LayerName = "world_back";
  sprite: Graphics = new Graphics();
  ball: Ball;
  angle: number;

  constructor(ball: Ball, angle: number = degToRad(45)) {
    super();
    this.ball = ball;
    this.angle = angle;

    // this.sprite.filters = [makeShaderFilter(BallShadowShader)];
  }

  onRender() {
    this.sprite.position.set(...this.ball.getPosition());
    const { angle, ball } = this;

    const c = Math.cos(angle);
    const s = Math.sin(angle);

    this.sprite.beginFill(0x000000, 0.1);
    this.sprite.drawCircle(
      c * ball.radius * RESAMPLE,
      s * ball.radius * RESAMPLE,
      ball.radius * RESAMPLE
    );
    this.sprite.endFill();
    this.sprite.scale.set(1.3 / RESAMPLE);
    this.sprite.skew.set(1 + c * SKEW_AMOUNT, 1 + s * SKEW_AMOUNT);

    this.angle = normalizeRad(this.angle + 0.03);
  }
}
