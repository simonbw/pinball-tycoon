import { Vector2 } from "three";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import Game from "../../core/Game";

const bloomPass = new UnrealBloomPass(new Vector2(2 ** 9, 2 ** 9), 3, 0, 0.9);

export function initializeFilters(game: Game) {
  // game.renderer.composer.addPass(bloomPass);
}
