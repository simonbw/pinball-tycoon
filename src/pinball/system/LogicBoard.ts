import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { KeyCode } from "../../core/io/Keys";
import Ball from "../ball/Ball";
import Table from "../tables/Table";
import { getBinding } from "../ui/KeyboardBindings";
import { SoundInstance } from "./SoundInstance";

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

interface NewBallEvent {
  type: "newBall";
  noSound?: boolean;
}

/**
 * Controls the behind the scenes stuff.
 */
export default class LogicBoard extends BaseEntity implements Entity {
  tags = ["logic_board"];
  ballsRemaining: number = 0;
  score: number = 0;
  gameStarted: boolean = false;

  constructor(private table: Table) {
    super();
  }

  handlers = {
    gameStart: () => {
      // Clear the table
      this.clearTimers();
      for (const ball of [...this.game!.entities.getTagged("ball")]) {
        ball.destroy();
      }

      this.ballsRemaining = 3;
      this.score = 0;
      this.gameStarted = true;
      this.game!.dispatch(updateScoreEvent(this.score));

      this.addChild(new SoundInstance("upgrade"));
      this.game!.dispatch({ type: "newBall", noSound: true });
    },
    newBall: (e: NewBallEvent) => {
      if (!e.noSound) {
        this.addChild(new SoundInstance("upgrade"));
      }
      this.ballsRemaining -= 1;
      this.game!.addEntity(new Ball(this.table.ballDropPosition.clone()));
    },
    drain: async ({ ball }: DrainEvent) => {
      ball.destroy();

      if (this.ballsRemaining > 0) {
        this.addChild(new SoundInstance("drain"));
        await this.wait(1.0);
        this.game!.dispatch({ type: "newBall" });
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
  };

  onKeyDown(key: KeyCode) {
    if (!this.game?.paused) {
      switch (key) {
        case getBinding("START_GAME"):
          if (!this.gameStarted) {
            this.game!.dispatch({ type: "gameStart" });
          }
          break;
        case getBinding("LEFT_FLIPPER"):
          this.game!.dispatch({ type: "leftFlipperUp" });
          this.addChild(
            new SoundInstance("flipperUp", { gain: 0.3, pan: -0.4 })
          );
          break;
        case getBinding("RIGHT_FLIPPER"):
          this.game!.dispatch({ type: "rightFlipperUp" });
          this.addChild(
            new SoundInstance("flipperUp", { gain: 0.3, pan: 0.4 })
          );
          break;
      }
    }
  }

  onKeyUp(key: KeyCode) {
    if (!this.game?.paused) {
      switch (key) {
        case getBinding("LEFT_FLIPPER"):
          this.game!.dispatch({ type: "leftFlipperDown" });
          this.addChild(
            new SoundInstance("flipperDown", { gain: 0.3, pan: -0.4 })
          );
          break;
        case getBinding("RIGHT_FLIPPER"):
          this.game!.dispatch({ type: "rightFlipperDown" });
          this.addChild(
            new SoundInstance("flipperDown", { gain: 0.3, pan: 0.4 })
          );
          break;
      }
    }
  }
}

/** Type guard for ball entity */
export function isLogicBoard(e?: Entity): e is LogicBoard {
  return e instanceof LogicBoard;
}
