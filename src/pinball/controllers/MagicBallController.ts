import BaseEntity from "../../core/entity/BaseEntity";
import Ball, { isBall } from "../playfield/Ball";
import { V } from "../../core/Vector";
import Entity from "../../core/entity/Entity";
import { KeyCode } from "../../core/io/Keys";

const FORCE = 150;
const GRAVITY_COMP = 132;

const KEY_MULTIBALL: KeyCode = "KeyB";
const KEY_RESET: KeyCode = "KeyR";
const KEY_LEFT: KeyCode = "ArrowLeft";
const KEY_UP: KeyCode = "ArrowUp";
const KEY_RIGHT: KeyCode = "ArrowRight";
const KEY_DOWN: KeyCode = "ArrowDown";

const RESET_POSITION = V([26, 90]);

/** Magically control the ball to put it where we want it */
export default class MagicBallController extends BaseEntity implements Entity {
  onTick() {
    const ball = this.getBall();
    if (ball) {
      // Keyboard control
      if (this.game!.io.keyIsDown(KEY_LEFT)) {
        ball.body.applyForce([-FORCE, 0]);
      }
      if (this.game!.io.keyIsDown(KEY_UP)) {
        ball.body.applyForce([0, -FORCE - GRAVITY_COMP]);
      }
      if (this.game!.io.keyIsDown(KEY_RIGHT)) {
        ball.body.applyForce([FORCE, 0]);
      }
      if (this.game!.io.keyIsDown(KEY_DOWN)) {
        ball.body.applyForce([0, FORCE]);
      }

      // Snap to mouse
      if (this.game!.io.lmb) {
        const p = this.game!.camera.toWorld(this.game!.io.mousePosition);
        ball.body.position = p;
        ball.body.velocity = [0, 0];
      }
    }
  }

  getBall(): Ball | null {
    const ball = this.game!.entities.getTagged("ball")[0];
    if (isBall(ball)) {
      return ball;
    }
    return null;
  }

  onKeyDown(key: KeyCode) {
    const ball = this.getBall();
    if (ball) {
      switch (key) {
        case KEY_RESET:
          ball.body.position = RESET_POSITION.clone();
          ball.body.velocity = [0, 0];
          ball.body.angularVelocity = 0;
          break;
        case KEY_MULTIBALL:
          this.game!.addEntity(new Ball(RESET_POSITION));
          break;
      }
    }
  }

  onMouseDown() {
    const ball = this.getBall();
    if (ball) {
    }
  }
}
