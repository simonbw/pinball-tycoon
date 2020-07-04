import BaseEntity from "../core/entity/BaseEntity";
import Ball, { isBall } from "./playfield/Ball";
import { V } from "../core/Vector";
import Entity from "../core/entity/Entity";

const FORCE = 50;
const GRAVITY_COMP = 132;

const MULTIBALL_KEY = 66; // B
const RESET_KEY = 82; // R
const KEY_LEFT = 37;
const KEY_UP = 38;
const KEY_RIGHT = 39;
const KEY_DOWN = 40;

const RESET_POSITION = V([26, 90]);

/** Magically control the ball to put it where we want it */
export default class BallMagic extends BaseEntity implements Entity {
  onTick() {
    const ball = this.getBall();
    if (ball) {
      // Keyboard control
      if (this.game!.io.keys[KEY_LEFT]) {
        ball.body.applyForce([-FORCE, 0]);
      }
      if (this.game!.io.keys[KEY_UP]) {
        ball.body.applyForce([0, -FORCE - GRAVITY_COMP]);
      }
      if (this.game!.io.keys[KEY_RIGHT]) {
        ball.body.applyForce([FORCE, 0]);
      }
      if (this.game!.io.keys[KEY_DOWN]) {
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

  onKeyDown(key: number) {
    const ball = this.getBall();
    if (ball) {
      switch (key) {
        case RESET_KEY:
          ball.body.position = RESET_POSITION.clone();
          ball.body.velocity = [0, 0];
          ball.body.angularVelocity = 0;
          break;
        case MULTIBALL_KEY:
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
