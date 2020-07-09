import { clamp, degToRad } from "../../core/util/MathUtil";
import { rNormal, rUniform } from "../../core/util/Random";
import { ParticleSystemParams } from "./ParticleSystem";

const SPREAD = degToRad(90);

interface Params {
  direction: number;
  impact: number;
  ballSpin: number;
  size?: number;
}

export function makeSparkParams({
  direction,
  impact,
  ballSpin,
  size = 0.25,
}: Params): Partial<ParticleSystemParams> {
  return {
    lifespan: 0.5,
    friction: 0.0,
    swirlFriction: 1.0,
    getSize: () => rNormal(1.0, 0.15) * size,
    getSwirl: () => rNormal(ballSpin / 200.0, 5.0),
    getLife: () => rUniform(0.5, 1.0),
    getDirection: () => rNormal(direction, SPREAD),
    getSpeed: () => (impact + 10) ** 1.2 * 0.8 * rUniform(0.3, 1.0),
    lifeToAlpha: (life) => life ** 1.2 / 1.2,
  };
}
