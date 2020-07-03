import "./core/Polyfills";

import Game from "./core/Game";
import AutoPauser from "./core/AutoPauser";
import { waitForFontsLoaded } from "./core/resources/fonts";
import { loadPixiAssets } from "./core/resources/images";
import { loadAllSounds } from "./core/resources/sounds";
import FPSMeter from "./core/util/FPSMeter";
import { ContactMaterials } from "./pinball/Materials";
import { setupTable } from "./pinball/Table";

// TODO: Font loading somewhere else
// @ts-ignore
import dsDigitalUrl from "../resources/fonts/ds-digi.ttf";
import BallMagic from "./pinball/BallMagic";
import PauseController from "./pinball/PauseController";

declare global {
  interface Window {
    DEBUG: {
      game: Game | null;
    };
  }
}

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
  window.DEBUG = { game: null };
  game.renderer.showCursor();
  game.addEntity(new AutoPauser());
  game.addEntity(new PauseController());
  game.addEntity(new BallMagic());
  game.addEntity(new FPSMeter());
  setupTable(game);
  game.start();
});
