import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { KeyCode } from "../../core/io/Keys";
import Ball from "../ball/Ball";
import { SoundInstance } from "../sound/SoundInstance";
import Table from "../tables/Table";
import { getBinding } from "../ui/KeyboardBindings";
import { PositionalSound } from "../sound/PositionalSound";
import { getSoundDuration } from "../../core/resources/sounds";
import BallSaveSystem from "./BallSaveSystem";
import { ControllerButton } from "../../core/io/Gamepad";
import FlipperController from "./FlipperController";
import { TiltEvent } from "./TiltMeter";
import { RolloverEvent } from "../playfield/Rollover";

export interface DrainEvent {
  type: "drain";
  ball: Ball;
}

export interface ScoreEvent {
  type: "score";
  points: number;
}

export function scoreEvent(points: number): ScoreEvent {
  return { type: "score", points };
}

export interface UpdateScoreEvent {
  type: "updateScore";
  score: number;
}

export function updateScoreEvent(score: number): UpdateScoreEvent {
  return { type: "updateScore", score };
}

export interface NewBallEvent {
  type: "newBall";
  fromSave?: boolean;
}

function newBallEvent(fromSave?: boolean): NewBallEvent {
  return { type: "newBall", fromSave };
}

export interface BallsRemainingEvent {
  type: "ballsRemaining";
  ballsRemaining: number;
}

function ballsRemainingEvent(ballsRemaining: number): BallsRemainingEvent {
  return {
    type: "ballsRemaining",
    ballsRemaining,
  };
}

/**
 * Controls the behind the scenes stuff.
 */
export default class LogicBoard extends BaseEntity implements Entity {
  tags = ["logic_board"];
  ballsRemaining: number = 0;
  score: number = 0;
  gameStarted: boolean = false;
  ballSaveSystem: BallSaveSystem;

  constructor(private table: Table) {
    super();
    this.ballSaveSystem = this.addChild(new BallSaveSystem());
    this.addChild(new FlipperController());
  }

  handlers = {
    gameStart: async () => {
      // Clear the table
      this.clearTimers();
      for (const ball of [...this.game!.entities.getTagged("ball")]) {
        ball.destroy();
      }

      this.ballsRemaining = 3;
      this.score = 0;
      this.gameStarted = true;
      this.game!.dispatch(updateScoreEvent(this.score));

      this.addChild(
        new PositionalSound("quarterDrop1", this.table.coinSlotPos)
      );
      const soundDuration = getSoundDuration("quarterDrop1");

      await this.wait(soundDuration * 0.7);
      this.game!.dispatch(ballsRemainingEvent(this.ballsRemaining));
      await this.wait(soundDuration * 0.3 + 0.3);

      this.game!.dispatch(newBallEvent());
    },

    newBall: async (e: NewBallEvent) => {
      if (e.fromSave) {
        this.addChild(new SoundInstance("defenderDown1"));
      } else {
        this.addChild(new SoundInstance("upgrade"));
        this.ballsRemaining -= 1;
        this.game!.dispatch(ballsRemainingEvent(this.ballsRemaining));
      }
      await this.wait(0.7);
      this.table.addChild(new Ball(this.table.ballDropPosition.clone(), 6));
    },

    drain: async ({ ball }: DrainEvent) => {
      ball.destroy();
      await this.wait(0.1);

      this.addChild(
        new PositionalSound("ballDrop1", this.table.bounds.bottomMiddle)
      );

      if (this.ballSaveSystem.saveIfPossible()) {
        await this.wait(0.8);
        console.log("ball saved");
        this.game!.dispatch(newBallEvent(true));
      } else if (this.ballsRemaining > 0) {
        this.addChild(new SoundInstance("drain"));
        await this.wait(1.0);
        this.game!.dispatch(newBallEvent());
      } else {
        this.game!.dispatch({ type: "gameOver" });
      }
    },

    gameOver: () => {
      this.gameStarted = false;
      this.addChild(new SoundInstance("drain"));
    },

    score: ({ points }: ScoreEvent) => {
      this.score += points;
      this.game!.dispatch(updateScoreEvent(this.score));
    },

    tilt: ({ count }: TiltEvent) => {
      console.log("tilt!");
      if (count >= 3) {
        this.score = 0;
        this.game!.dispatch(updateScoreEvent(this.score));
        this.game!.dispatch({ type: "gameOver" });
      }
    },

    // TODO: Move this to an objectives logic board
    rollover: (e: RolloverEvent) => {
      this.game!.dispatch(scoreEvent(1000));
    },
  };

  onKeyDown(key: KeyCode) {
    if (key == getBinding("START_GAME")) {
      if (!this.gameStarted) {
        this.game!.dispatch({ type: "gameStart" });
      }
    }
  }

  onButtonUp(button: ControllerButton) {
    if (button === ControllerButton.START) {
      if (!this.gameStarted) {
        this.game!.dispatch({ type: "gameStart" });
      }
    }
  }
}

/** Type guard for ball entity */
export function isLogicBoard(e?: Entity): e is LogicBoard {
  return e instanceof LogicBoard;
}
