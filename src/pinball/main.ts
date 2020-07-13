import AutoPauser from "../core/AutoPauser";
import Game from "../core/Game";
import { waitForFontsLoaded } from "../core/resources/fonts";
import { loadAllSounds } from "../core/resources/sounds";
import PauseController from "./controllers/PauseController";
import { initializeFilters } from "./graphics/postprocessing";
import { ContactMaterials } from "./playfield/Materials";
import Table from "./tables/HockeyTable";
import { waitForTexturesLoaded } from "./graphics/textures";
import GraphicsQualityController from "./controllers/GraphicsQualityController";
import Preloader from "./Preloader";

declare global {
  interface Window {
    DEBUG: { game?: Game };
  }
}

export async function main() {
  // TODO: Font loading somewhere else

  await new Promise((resolve) => window.addEventListener("load", resolve));
  const audioContext = new AudioContext();

  const game = new Game(audioContext, ContactMaterials, 20);
  window.DEBUG = { game };
  game.start();

  const preloader = game.addEntity(new Preloader());

  await preloader.waitTillLoaded();

  game.world.frictionGravity = 10; // TODO: Tune this
  game.addEntity(new AutoPauser());
  game.addEntity(new PauseController());
  game.addEntity(new GraphicsQualityController());
  game.addEntity(new Table());
}
