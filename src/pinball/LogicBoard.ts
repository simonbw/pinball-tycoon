import BaseEntity from "../core/entity/BaseEntity";
import Entity from "../core/entity/Entity";
import { KeyCode } from "../core/io/Keys";
import { Vector, V } from "../core/Vector";
import Ball from "./playfield/Ball";
import { playSoundEvent } from "./Soundboard";
import { getBinding } from "./ui/KeyboardBindings";

const NEW_BALL_LOCATION: Vector = V(26, 95);

export interface DrainEvent {
  type: "drain";
  ball: Ball;
}

export interface ScoreEvent {
  type: "score";
  points: number;
}

export interface UpdateScoreEvent {
  type: "update_score";
  points: number;
}

/**
 * Controls the behind the scenes stuff.
 */
export default class LogicBoard extends BaseEntity implements Entity {
  tags = ["logic_board"];
  ballsRemaining: number = 0;
  score: number = 0;
  gameStarted: boolean = false;

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

      this.game!.dispatch(playSoundEvent("gameStart", { gain: 0.5 }));
      this.game!.dispatch({ type: "newBall", noSound: true });
    },
    newBall: (e: NewBallEvent) => {
      if (!e.noSound) {
        this.game!.dispatch(playSoundEvent("newBall", { gain: 0.5 }));
      }
      this.ballsRemaining -= 1;
      this.game!.addEntity(new Ball(NEW_BALL_LOCATION.clone()));
    },
    score: ({ points }: ScoreEvent) => {
      this.score += points;
    },
    drain: async ({ ball }: DrainEvent) => {
      ball.destroy();

      if (this.ballsRemaining > 0) {
        this.game!.dispatch(playSoundEvent("drain", { gain: 0.5 }));
        await this.wait(1.0);
        this.game!.dispatch({ type: "newBall" });
      } else {
        this.game!.dispatch({ type: "gameOver" });
      }
    },
    gameOver: () => {
      this.gameStarted = false;
      this.game!.dispatch(playSoundEvent("gameOver", { gain: 0.5 }));
      console.log("Game Over");
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
          this.game!.dispatch(
            playSoundEvent("flipperUp", { gain: 0.3, pan: -0.4 })
          );
          break;
        case getBinding("RIGHT_FLIPPER"):
          this.game!.dispatch({ type: "rightFlipperUp" });
          this.game!.dispatch(
            playSoundEvent("flipperUp", { gain: 0.3, pan: 0.4 })
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
          this.game!.dispatch(
            playSoundEvent("flipperDown", { gain: 0.3, pan: -0.4 })
          );
          break;
        case getBinding("RIGHT_FLIPPER"):
          this.game!.dispatch({ type: "rightFlipperDown" });
          this.game!.dispatch(
            playSoundEvent("flipperDown", { gain: 0.3, pan: 0.4 })
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

interface NewBallEvent {
  type: "newBall";
  noSound?: boolean;
}
