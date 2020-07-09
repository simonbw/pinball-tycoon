import * as Pixi from "pixi.js";
import { hexToVec3 } from "../../core/util/ColorUtils";
import {
  getLightUniformsForPoint,
  LightUniforms,
} from "../lighting/LightUniforms";
import Ball from "../playfield/Ball";
import fragCode from "./BallShader.frag";
import vertCode from "./BallShader.vert";

const DIFFUSE_COLOR = 0x999999;
const SPECULAR_COLOR = 0x999999;
const AMBIENT_COLOR = 0x333333;
const SHININESS = 14.0;

export default class BallShaderFilter extends Pixi.Filter {
  ball: Ball;
  constructor(ball: Ball) {
    super(vertCode, fragCode);
    this.ball = ball;
    this.autoFit = false;
  }

  apply(
    filterManager: Pixi.systems.FilterSystem,
    input: Pixi.RenderTexture,
    output: Pixi.RenderTexture,
    clearMode: Pixi.CLEAR_MODES
  ): void {
    if (this.ball.game) {
      const uniforms = this.uniforms as BallShaderUniforms;
      const [x, y] = this.ball.body.position;
      const r = this.ball.radius;
      const game = this.ball.game!;
      const lightUniforms = getLightUniformsForPoint(game, [x, y, r], r, r);
      // Lights
      uniforms.vLightPosition = lightUniforms.vLightPosition;
      uniforms.vLightColor = lightUniforms.vLightColor;
      uniforms.fLightPower = lightUniforms.fLightPower;
      uniforms.fLightLinearFade = lightUniforms.fLightLinearFade;
      uniforms.fLightQuadraticFade = lightUniforms.fLightQuadraticFade;
      //Materials
      uniforms.fMaterialShininess = SHININESS;
      uniforms.vMaterialDiffuseColor = hexToVec3(DIFFUSE_COLOR);
      uniforms.vMaterialSpecularColor = hexToVec3(SPECULAR_COLOR);
      uniforms.vAmbientLightColor = hexToVec3(AMBIENT_COLOR);
      // Other
      uniforms.ballCoords = [x, y];

      filterManager.applyFilter(this, input, output, clearMode);
    } else {
      console.warn("applying filter for removed ball for some reason");
    }
  }
}

interface BallShaderUniforms extends LightUniforms {
  vAmbientLightColor: [number, number, number];
  vMaterialDiffuseColor: [number, number, number];
  vMaterialSpecularColor: [number, number, number];
  fMaterialShininess: number;

  ballCoords: [number, number];
}
