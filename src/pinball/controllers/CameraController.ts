import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { NudgeEvent } from "./NudgeController";

const NUDGE_SCALE = 1 / 2.8;
const ZOOM_SPEED = 0.005;
const PAN_SPEED = 2.0;

export default class CameraController extends BaseEntity implements Entity {
  constructor() {
    super();
  }

  onRender() {
    const camera = this.game!.camera;

    const io = this.game!.io;
    if (io.keyIsDown("Equal")) {
      camera.z *= 1.0 + ZOOM_SPEED;
    }
    if (io.keyIsDown("Minus")) {
      camera.z *= 1.0 - ZOOM_SPEED;
    }

    // if (io.keyIsDown("KeyI")) {
    //   camera.y -= PAN_SPEED / camera.z;
    // }
    // if (io.keyIsDown("KeyK")) {
    //   camera.y += PAN_SPEED / camera.z;
    // }
    // if (io.keyIsDown("KeyJ")) {
    //   camera.x -= PAN_SPEED / camera.z;
    // }
    // if (io.keyIsDown("KeyL")) {
    //   camera.x += PAN_SPEED / camera.z;
    // }
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
  };
}
