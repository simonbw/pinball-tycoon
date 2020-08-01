import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import Backglass from "./Backglass";
import { KeyCode, keyCodeToName } from "../../core/io/Keys";
import { getBinding } from "./KeyboardBindings";
import LogicBoard, {
  GamePhase,
  UpdateScoreEvent,
  NewBallEvent,
} from "../system/LogicBoard";
import Objective from "../objectives/Objective";
import { NewObjectiveEvent } from "../system/ObjectivesSystem";
import { TiltEvent } from "../system/TiltMeter";

export interface FlashTextEvent {
  text: string;
  duration?: number;
}

export default class BackglassController extends BaseEntity implements Entity {
  statsEnabled: boolean = false;
  textToFlash?: string;
  score: number = 0;
  currentObjective?: Objective;

  constructor(private backglass: Backglass) {
    super();
  }

  onRender() {
    const backglass = this.backglass;
    this.backglass.clear();

    const gamePhase = this.gamePhase;

    if (this.game!.paused) {
      const pauseKeyName = keyCodeToName(getBinding("PAUSE"));
      backglass.renderText(`Paused`, "middle");
      backglass.renderText(
        `Press ${pauseKeyName} to unpause`,
        "sub-middle",
        48
      );
    } else if (this.textToFlash) {
      backglass.renderText(this.textToFlash, "middle", 80);
    } else if (gamePhase === "off") {
      const startKeyName = keyCodeToName(getBinding("START_GAME"));
      backglass.renderText(`Press ${startKeyName} to start`, "middle");
    } else if (gamePhase === "awaiting-plunge") {
      this.renderScore();
      const plungeKeyName = keyCodeToName(getBinding("PLUNGE"));
      backglass.renderText(`Hold ${plungeKeyName} to plunge`, "middle");
    } else if (gamePhase === "playing") {
      this.renderScore();
      if (this.currentObjective) {
        backglass.renderText(`${this.currentObjective}`, "middle");
      }
    } else if (gamePhase === "game-over") {
      this.renderScore();
      const startKeyName = keyCodeToName(getBinding("START_GAME"));
      if (this.game!.elapsedTime % 10 < 5) {
        backglass.renderText(`Press ${startKeyName} to play again`, "middle");
      } else {
        backglass.renderText(`Game Over`, "middle");
      }
    }

    if (this.statsEnabled) {
      backglass.renderStats();
    }

    backglass.texture.needsUpdate = true;
  }

  renderScore() {
    const score = this.score.toLocaleString(undefined, { useGrouping: true });
    this.backglass.renderText(`${score} pts`, "top-right");
  }

  async flashText(text: string, duration: number = 3.0) {
    this.clearTimers("flashText");
    this.textToFlash = text;
    await this.wait(duration, undefined, "flashText");
    this.textToFlash = undefined;
  }

  handlers = {
    flashText: async ({ text, duration }: FlashTextEvent) => {
      this.flashText(text, duration);
    },

    updateScore: ({ score }: UpdateScoreEvent) => {
      this.score = score;
    },

    newObjective: ({ objective }: NewObjectiveEvent) => {
      this.currentObjective = objective;
      this.flashText("NEW OBJECTIVE", 2.0);
    },

    ballSaved: () => {
      this.flashText("Ball Saved");
    },

    tilt: ({ count }: TiltEvent) => {
      if (count >= 3) {
        this.flashText("TILT!", 4);
      } else {
        this.flashText("WARNING!", 1);
      }
    },
  };

  onKeyDown(keyCode: KeyCode) {
    if (keyCode === getBinding("TOGGLE_STATS")) {
      this.statsEnabled = !this.statsEnabled;
    }
  }

  get gamePhase(): GamePhase {
    const logicBoard = this.game!.entities.getTagged("logic_board")[0]!;
    if (logicBoard instanceof LogicBoard) {
      return logicBoard.gamePhase;
    }
    return "off";
  }
}
