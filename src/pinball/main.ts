import AutoPauser from "../core/AutoPauser";
import Game from "../core/Game";
import { waitForFontsLoaded } from "../core/resources/fonts";
import { loadPixiAssets } from "../core/resources/images";
import { loadAllSounds } from "../core/resources/sounds";
import FPSMeter from "../core/util/FPSMeter";
import dsDigitalUrl from "../../resources/fonts/ds-digi.ttf";
import PauseController from "./controllers/PauseController";
import { ContactMaterials } from "./playfield/Materials";
import { setupTable } from "./Table";

declare global {
  interface Window {
    DEBUG: {
      game?: Game;
    };
  }
}

export async function main() {
  // TODO: Font loading somewhere else
  const digiFont = new FontFace("DS Digital", `url(${dsDigitalUrl})`);

  window.addEventListener("load", async () => {
    const audioContext = new AudioContext();

    console.log("window load");
    await Promise.all([
      loadPixiAssets(),
      waitForFontsLoaded([digiFont]),
      loadAllSounds(audioContext),
    ]);
    console.log("assets loaded");

    const game = new Game(audioContext, ContactMaterials, 20);
    window.DEBUG = { game };
    game.renderer.showCursor();
    game.renderer.pixiRenderer.backgroundColor = 0x262631;
    game.world.frictionGravity = 10; // TODO: Tune this
    game.addEntity(new AutoPauser());
    game.addEntity(new PauseController());
    game.addEntity(
      new FPSMeter([5, game.renderer.pixiRenderer.height / 2 - 20], 0xffffff)
    );

    setupTable(game);
    game.start();
  });
}
