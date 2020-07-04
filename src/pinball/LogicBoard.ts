import BaseEntity from "../core/entity/BaseEntity";
import Entity from "../core/entity/Entity";
import Timer from "../core/Timer";
import { V } from "../core/Vector";
import Ball from "./playfield/Ball";

const NEW_BALL_LOCATION = V([26, 95]);
const START_GAME_KEY = 83; // S

export interface DrainEvent {
  type: "drain";
  ball: Ball;
}

export interface ScoreEvent {
  type: "score";
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
      for (const ball of this.game!.entities.getTagged("ball")) {
        ball.destroy();
      }

      this.ballsRemaining = 3;
      this.score = 0;
      this.gameStarted = true;

      this.game!.dispatch({ type: "newBall" });
    },
    newBall: () => {
      this.ballsRemaining -= 1;
      this.game!.addEntity(new Ball(NEW_BALL_LOCATION.clone()));
    },
    score: ({ points }: ScoreEvent) => {
      this.score += points;
    },
    drain: ({ ball }: DrainEvent) => {
      console.log("drain");
      ball.destroy();

      if (this.ballsRemaining > 0) {
        this.addChild(
          new Timer(1.0, () => {
            this.game!.dispatch({ type: "newBall" });
          })
        );
      } else {
        this.game!.dispatch({ type: "gameOver" });
      }
    },
    gameOver: () => {
      this.gameStarted = false;
      console.log("Game Over");
    },
  };

  onKeyDown(key: number) {
    switch (key) {
      case START_GAME_KEY:
        this.game!.dispatch({ type: "gameStart" });
        break;
    }
  }
}

/** Type guard for ball entity */
export function isLogicBoard(e?: Entity): e is LogicBoard {
  return Boolean(e && e.tags && e.tags.indexOf("logic_board") >= 0);
}
