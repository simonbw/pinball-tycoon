import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import Game from "../../core/Game";
import focusFragShader from "./focusFragShader.frag";
import focusVertShader from "./focusVertShader.vert";
import glowFragShader from "./glowFragShader.frag";
import glowVertShader from "./glowVertShader.vert";

const FOCUS_UNIFORMS = {
  tDiffuse: { value: null },
  opacity: { value: 1.0 },
  focusAmount: { value: 0.0 },
};

const GLOW_UNIFORMS = {
  tDiffuse: { value: null },
  opacity: { value: 1.0 },
};

const focusPass = new ShaderPass({
  uniforms: FOCUS_UNIFORMS,
  vertexShader: focusVertShader,
  fragmentShader: focusFragShader,
});

const glowPass = new ShaderPass({
  uniforms: GLOW_UNIFORMS,
  vertexShader: glowVertShader,
  fragmentShader: glowFragShader,
});

export function initPostProcessing(game: Game) {
  // game.renderer.composer.addPass(glowPass);
  game.renderer.composer.addPass(focusPass);
}

export function setFocusAmount(value: number) {
  focusPass.uniforms.focusAmount.value = value;
}
