import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { KeyCode } from "../../core/io/Keys";
import { lerp } from "../../core/util/MathUtil";
import { V, Vector } from "../../core/Vector";
import { isBall } from "../playfield/Ball";
import { NudgeEvent } from "./NudgeController";
import { Camera, Vector3 } from "three";
import Game from "../../core/Game";

const NUDGE_SCALE = 1 / 2.8;
const ZOOM_SPEED = 0.005;
const PAN_SPEED = 2.0;

export default class CameraController extends BaseEntity implements Entity {
  tableCenter: Vector;
  lookTarget: Vector;
  private nudgeOffset = V(0, 0);

  constructor(tableCenter: Vector) {
    super();
    this.tableCenter = tableCenter.clone();
    this.lookTarget = tableCenter.clone();
  }

  onAdd(game: Game) {
    game.camera.position.set(0, 110, -60);
  }

  onRender() {
    if (!this.game) return;

    const camera = this.game.camera;
    camera.up.set(0, -0.3, -1);
    this.manualMove(camera);

    const ball = this.game.entities.getTagged("ball")[0];
    const t = this.tableCenter;
    if (isBall(ball)) {
      const b = ball.getPosition();
      const x = lerp(t.x, b.x, 0.4);
      const y = lerp(t.y, b.y, 0.3);
      this.lookTarget.ilerp(V(x, y), 0.1);
    } else {
      this.lookTarget.ilerp(this.tableCenter, 0.1);
    }

    camera.lookAt(this.lookTarget.x, this.lookTarget.y, 0);
  }

  handlers = {
    nudge: async (e: NudgeEvent) => {
      // const camera = this.game!.camera;
      // await this.wait(e.duration / 2, (dt) =>
      //   this.nudgeOffset.iadd(e.impulse.mul(NUDGE_SCALE * dt))
      // );
      // await this.wait(e.duration / 2, (dt) =>
      //   this.nudgeOffset.iadd(e.impulse.mul(-NUDGE_SCALE * dt))
      // );
    },
  };

  manualMove(camera: Camera) {
    const io = this.game!.io;
    if (io.keyIsDown("Equal")) {
      camera.position.add(camera.up);
    }
    if (io.keyIsDown("Minus")) {
      camera.position.add(camera.up.clone().multiplyScalar(-1));
    }

    const t = this.tableCenter;
    const c = V(camera.position.x, camera.position.y);
    const r = c.sub(t).inormalize();
    const n = r.rotate90cw();
    const p = n.imul(PAN_SPEED);
    if (io.keyIsDown("KeyI")) {
      camera.position.x -= r.x;
      camera.position.y -= r.y;
    }
    if (io.keyIsDown("KeyK")) {
      camera.position.x += r.x;
      camera.position.y += r.y;
    }
    if (io.keyIsDown("KeyJ")) {
      camera.position.x -= p.x;
      camera.position.y -= p.y;
    }
    if (io.keyIsDown("KeyL")) {
      camera.position.x += p.x;
      camera.position.y += p.y;
    }
  }
}
