import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { KeyCode } from "../../core/io/Keys";
import { Vector, V } from "../../core/Vector";
import Ball, { isBall } from "../playfield/Ball";
import { getBinding } from "../ui/KeyboardBindings";

const FORCE = 150;
const GRAVITY_COMP = 132;

const RESET_POSITION: Vector = V(26, 90);

/** Magically control the ball to put it where we want it */
export default class MagicBallController extends BaseEntity implements Entity {
  onTick() {
    const ball = this.getBall();
    if (ball) {
      // Keyboard control
      if (this.game!.io.keyIsDown(getBinding("MAGIC.LEFT"))) {
        ball.body.applyForce([-FORCE, 0]);
      }
      if (this.game!.io.keyIsDown(getBinding("MAGIC.UP"))) {
        ball.body.applyForce([0, -FORCE - GRAVITY_COMP]);
      }
      if (this.game!.io.keyIsDown(getBinding("MAGIC.RIGHT"))) {
        ball.body.applyForce([FORCE, 0]);
      }
      if (this.game!.io.keyIsDown(getBinding("MAGIC.DOWN"))) {
        ball.body.applyForce([0, FORCE]);
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
        case getBinding("MAGIC.RESET"):
          ball.body.position = RESET_POSITION.clone();
          ball.body.velocity = [0, 0];
          ball.body.angularVelocity = 0;
          break;
        case getBinding("MAGIC.MULTI"):
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
