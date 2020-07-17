import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import Game from "../../core/Game";
import focusFragShader from "./focusFragShader.frag";
import focusVertShader from "./focusVertShader.vert";

const FOCUS_UNIFORMS = {
  tDiffuse: { value: null },
  opacity: { value: 1.0 },
  focusAmount: { value: 0.8 },
};

const focusPass = new ShaderPass({
  uniforms: FOCUS_UNIFORMS,
  vertexShader: focusVertShader,
  fragmentShader: focusFragShader,
});

export function initPostProcessing(game: Game) {
  // game.renderer.composer.addPass(focusPass);
}

export function setFocusAmount(value: number) {
  focusPass.uniforms.focusAmount.value = value;
}
