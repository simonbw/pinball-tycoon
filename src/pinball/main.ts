import hockeyTable from "../../resources/tables/hockey-table.svg";
import AutoPauser from "../core/AutoPauser";
import Game from "../core/Game";
import GraphicsQualityController from "./controllers/GraphicsQualityController";
import PauseController from "./controllers/PauseController";
import { ContactMaterials } from "./playfield/P2Materials";
import { initPostProcessing } from "./postprocessing";
import Preloader from "./Preloader";
import { makeSVGTable } from "./tables/SvgTable/SVGTable";
import HockeyTable from "./tables/HockeyTable";

declare global {
  interface Window {
    DEBUG: { game?: Game };
  }
}

// Object3D.DefaultUp.set(0, 0, -1);

export async function main() {
  await new Promise((resolve) => window.addEventListener("load", resolve));

  const audioContext = new AudioContext();

  const game = new Game(audioContext, ContactMaterials, 22);
  window.DEBUG = { game };
  game.start();

  const preloader = game.addEntity(new Preloader());
  await preloader.waitTillLoaded();

  initPostProcessing(game);

  game.world.frictionGravity = 10; // TODO: Tune this
  game.addEntity(new AutoPauser());
  game.addEntity(new PauseController());
  game.addEntity(new GraphicsQualityController());
  // game.addEntity(new HockeyTable());
  game.addEntity(await makeSVGTable(hockeyTable));

  // So we don't remove the html from the screen until we've actually hopefully rendered the table
  preloader.destroy();
}
