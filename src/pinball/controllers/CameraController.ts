import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { NudgeEvent } from "./NudgeController";
import { Vector } from "../../core/Vector";
import { KeyCode } from "../../core/io/Keys";
import { isBall } from "../playfield/Ball";
import { updateHeadPosition } from "../layers";
import { lerp, clamp } from "../../core/util/MathUtil";

const NUDGE_SCALE = 1 / 2.8;
const ZOOM_SPEED = 0.005;
const PAN_SPEED = 2.0;

export default class CameraController extends BaseEntity implements Entity {
  defaultPos: Vector;
  manual: boolean = false;
  private nudgeOffset: Vector = [0, 0];

  constructor(tableCenter: Vector) {
    super();
    this.defaultPos = tableCenter;
    updateHeadPosition([0, 30]);
  }

  onRender() {
    if (!this.game) return;
    const camera = this.game!.camera;
    if (this.manual) {
      this.manualMove();
      return;
    }

    const ball = this.game.entities.getTagged("ball")[0];
    if (isBall(ball)) {
      const ballPos = ball.getPosition();
      const center = this.defaultPos.add(this.nudgeOffset);
      camera.center(center);
    } else {
      const center = this.defaultPos.add(this.nudgeOffset);
      camera.center(center);
    }
    // TODO: NUDGE!
  }

  handlers = {
    nudge: async (e: NudgeEvent) => {
      const camera = this.game!.camera;
      await this.wait(e.duration / 2, (dt) =>
        this.nudgeOffset.iadd(e.impulse.mul(NUDGE_SCALE * dt))
      );
      await this.wait(e.duration / 2, (dt) =>
        this.nudgeOffset.iadd(e.impulse.mul(-NUDGE_SCALE * dt))
      );
    },
    onKeyDown: (keyCode: KeyCode) => {
      if (keyCode === "KeyU") {
        this.manual = !this.manual;
      }
    },
  };

  manualMove() {
    const camera = this.game!.camera;
    const io = this.game!.io;
    if (io.keyIsDown("Equal")) {
      camera.z *= 1.0 + ZOOM_SPEED;
    }
    if (io.keyIsDown("Minus")) {
      camera.z *= 1.0 - ZOOM_SPEED;
    }

    if (io.keyIsDown("KeyI")) {
      camera.y -= PAN_SPEED / camera.z;
    }
    if (io.keyIsDown("KeyK")) {
      camera.y += PAN_SPEED / camera.z;
    }
    if (io.keyIsDown("KeyJ")) {
      camera.x -= PAN_SPEED / camera.z;
    }
    if (io.keyIsDown("KeyL")) {
      camera.x += PAN_SPEED / camera.z;
    }
  }
}
