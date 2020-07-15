import AutoPauser from "../core/AutoPauser";
import Game from "../core/Game";
import GraphicsQualityController from "./controllers/GraphicsQualityController";
import PauseController from "./controllers/PauseController";
import { ContactMaterials } from "./playfield/Materials";
import Preloader from "./Preloader";
import HockeyTable from "./tables/HockeyTable";
import hockeyTable from "../../resources/tables/hockey-table.svg";
import { makeSVGTable } from "./tables/SvgTable";

declare global {
  interface Window {
    DEBUG: { game?: Game };
  }
}

export async function main() {
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
  game.addEntity(new HockeyTable());

  // game.addEntity(await makeSVGTable(hockeyTable));
  preloader.destroy();
}
