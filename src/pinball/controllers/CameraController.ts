import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { NudgeEvent } from "./NudgeController";
import { Vector } from "../../core/Vector";
import { KeyCode } from "../../core/io/Keys";
import { isBall } from "../playfield/Ball";
import { updateHeadPosition } from "../layers";

const NUDGE_SCALE = 1 / 2.8;
const ZOOM_SPEED = 0.005;
const PAN_SPEED = 2.0;

export default class CameraController extends BaseEntity implements Entity {
  tableCenter: Vector;
  manual: boolean = false;
  private nudgeVelocity: Vector = [0, 0];

  constructor(tableCenter: Vector) {
    super();
    this.tableCenter = tableCenter;
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
      updateHeadPosition([0, 30]);
    } else {
      updateHeadPosition([0, 30]);
    }
  }

  handlers = {
    nudge: async (e: NudgeEvent) => {
      const camera = this.game!.camera;
      camera.velocity.set(e.impulse.mul(NUDGE_SCALE));
      await this.wait(e.duration / 2);
      camera.velocity.set(e.impulse.mul(-NUDGE_SCALE));
      await this.wait(e.duration / 2);
      camera.velocity.set(0, 0);
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
