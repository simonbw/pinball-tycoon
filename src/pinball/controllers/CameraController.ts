import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { NudgeEvent } from "./NudgeController";

const NUDGE_SCALE = 1 / 2.8;

export default class CameraController extends BaseEntity implements Entity {
  constructor() {
    super();
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
