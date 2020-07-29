import hockeyTable from "../../resources/tables/hockey-table.svg";
import AutoPauser from "../core/AutoPauser";
import Game from "../core/Game";
import GraphicsQualityController from "./controllers/GraphicsQualityController";
import PauseController from "./controllers/PauseController";
import { ContactMaterials } from "./playfield/P2Materials";
import { initPostProcessing } from "./postprocessing";
import Preloader from "./Preloader";
import { makeSVGTable } from "./tables/SvgTable/SVGTable";
import CustomBroadphase from "../core/physics/CustomBroadphase";
import CustomNarrowphase from "../core/physics/CustomNarrowphase";
import SimpleTable from "./tables/SimpleTable";
import HockeyTable from "./tables/HockeyTable";

declare global {
  interface Window {
    DEBUG: { game?: Game };
  }
}

// Object3D.DefaultUp.set(0, 0, -1);

export async function main() {
  await new Promise((resolve) => window.addEventListener("load", resolve));

  const game = new Game({
    tickIterations: 22,
    broadphase: new CustomBroadphase(),
    narrowphase: new CustomNarrowphase(),
  });

  for (const contactMaterial of ContactMaterials) {
    game.world.addContactMaterial(contactMaterial);
  }

  window.DEBUG = { game };
  game.start();

  const preloader = game.addEntity(new Preloader());
  await preloader.waitTillLoaded();

  initPostProcessing(game);

  game.world.frictionGravity = 10; // TODO: Tune this
  game.addEntity(new AutoPauser());
  game.addEntity(new PauseController());
  game.addEntity(new GraphicsQualityController());
  // game.addEntity(new SimpleTable());
  // game.addEntity(new HockeyTable());
  game.addEntity(await makeSVGTable(hockeyTable));

  // So we don't remove the html from the screen until we've actually hopefully rendered the table
  preloader.destroy();
}
