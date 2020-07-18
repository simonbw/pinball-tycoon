import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import Game from "../../core/Game";
import focusFragShader from "./focusFragShader.frag";
import focusVertShader from "./focusVertShader.vert";
import { Vector2 } from "three";

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

const bloomPass = new UnrealBloomPass(new Vector2(1024, 1024), 1.0, 4.0, 0.8);

export function initPostProcessing(game: Game) {
  // game.renderer.composer.addPass(bloomPass);
  game.renderer.composer.addPass(focusPass);
}

export function setFocusAmount(value: number) {
  focusPass.uniforms.focusAmount.value = value;
}
