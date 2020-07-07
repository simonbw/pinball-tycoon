import Game from "../../core/Game";
import { isLight, LightData } from "./Light";
import { hexToRGB, hexToVec3 } from "../../core/util/ColorUtils";

type vec3 = [number, number, number];

export interface LightUniforms {
  vLightPosition: Float32Array;
  vLightColor: Float32Array;
  fLightPower: Float32Array;
  fLightLinearFade: Float32Array;
  fLightQuadraticFade: Float32Array;
  fLightRadius: Float32Array;
}

const EMPTY_LIGHT: LightData = {
  position: [0, 0, 0],
  color: 0,
  power: 0,
  linearFade: 0,
  quadraticFade: 0,
  radius: 0,
};

export function getLightUniformsForPoint(
  game: Game,
  point: vec3,
  scale: number = 1.0,
  radius: number = 0.0,
  numLights: number = 8
): LightUniforms {
  // Find all the lights
  const datas = game.entities
    .getTagged("light")
    .filter(isLight)
    .map((light) => light.lightData);

  // Sort by most important
  datas.sort(
    (a, b) =>
      rankLight(a, point, radius + a.radius) -
      rankLight(b, point, radius + b.radius)
  );

  // Make sure we have the right number
  while (datas.length > numLights) {
    datas.pop();
  }
  while (datas.length < numLights) {
    datas.push(EMPTY_LIGHT);
  }

  // Convert these datas into uniforms
  return {
    vLightPosition: new Float32Array(
      ([] as number[]).concat(
        ...datas.map((data) => {
          return [
            (data.position[0] - point[0]) * scale,
            (data.position[1] - point[1]) * scale,
            (data.position[2] - point[2]) * scale,
          ];
        })
      )
    ),
    vLightColor: new Float32Array(
      ([] as number[]).concat(...datas.map((data) => hexToVec3(data.color)))
    ),
    fLightPower: new Float32Array(datas.map((data) => data.power)),
    fLightLinearFade: new Float32Array(datas.map((data) => data.linearFade)),
    fLightQuadraticFade: new Float32Array(
      datas.map((data) => data.quadraticFade)
    ),
    fLightRadius: new Float32Array(datas.map((data) => data.radius)),
  };
}

/**
 * Score a light for its relevance.
 */
function rankLight(data: LightData, point: vec3, radius: number = 0): number {
  const dx = point[0] - data.position[0];
  const dy = point[1] - data.position[1];
  const dz = point[2] - data.position[2];
  const d = Math.max(Math.sqrt(dx ** 2 + dy ** 2 + dz ** 2) - radius, 0);
  const divisor = 1.0 + d * d * data.quadraticFade + d * data.linearFade;
  return data.power / divisor;
}
