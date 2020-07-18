import { PerspectiveCamera, Vector3 } from "three";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import Game from "../../core/Game";
import { KeyCode } from "../../core/io/Keys";
import { lerp } from "../../core/util/MathUtil";
import { isBall } from "../ball/Ball";
import Table from "../tables/Table";
import { NudgeEvent } from "./NudgeController";
import { getBinding } from "../ui/KeyboardBindings";

const NUDGE_SCALE = 1 / 2.8;
const NUDGE_DURATION_SCALE = 1.3;

export default class CameraController extends BaseEntity implements Entity {
  table: Table;
  lookTarget: Vector3;
  normalPosition: Vector3;
  topPosition: Vector3;
  up: Vector3;
  nudgeOffset: Vector3 = new Vector3(0, 0, 0);

  mode: "normal" | "top" | "manual" | "ball" = "normal";

  constructor(table: Table) {
    super();
    this.table = table;
    this.lookTarget = table.center.clone();
    this.normalPosition = new Vector3(
      table.center.x,
      table.bounds.bottom + 10,
      -70
    );
    this.topPosition = new Vector3(
      this.table.center.x,
      this.table.center.y + 1, // Avoids flickering for some reason
      -100
    );
    this.up = new Vector3(0, 0, -1).applyAxisAngle(
      new Vector3(-1, 0, 0),
      this.table.incline
    );
  }

  onAdd(game: Game) {
    game.camera.position.copy(this.normalPosition);
    game.camera.up.copy(this.up);
  }

  onRender() {
    if (!this.game) return;

    const camera = this.game.camera as PerspectiveCamera;

    this.manualMode(camera);
    this.zoomControls(camera);

    switch (this.mode) {
      case "normal":
        this.normalMode(camera);
        break;
      case "top":
        this.topMode(camera);
        break;
      case "manual":
        this.manualMode(camera);
        break;
    }
  }

  onKeyDown(keyCode: KeyCode) {
    if (keyCode === getBinding("CAMERA_TOGGLE")) {
      switch (this.mode) {
        case "top":
          this.mode = "normal";
          break;
        case "normal":
          this.mode = "top";
          break;
        case "manual":
          this.mode = "top";
          break;
      }
    }
  }

  normalMode(camera: PerspectiveCamera) {
    const game = this.game!;
    camera.position.sub(this.nudgeOffset);

    lerpOrJump(camera.position, this.normalPosition, 0.1);

    const balls = game.entities.getTagged("ball").filter(isBall);
    const weightedCenter = this.table.center.clone();
    for (const ball of balls) {
      weightedCenter.y = lerp(weightedCenter.y, ball.getPosition().y, 0.3);
    }
    const speed = balls.length > 0 ? 0.1 : 0.01;
    this.lookTarget.lerp(weightedCenter, speed);

    camera.lookAt(this.lookTarget.x, this.lookTarget.y, 0);

    camera.position.add(this.nudgeOffset);
  }

  topMode(camera: PerspectiveCamera) {
    camera.position.sub(this.nudgeOffset);

    lerpOrJump(camera.position, this.topPosition, 0.2);
    camera.lookAt(this.table.center);
    camera.position.add(this.nudgeOffset);
  }

  manualMode(camera: PerspectiveCamera) {
    camera.position.sub(this.nudgeOffset);

    const io = this.game!.io;
    if (io.keyIsDown("KeyO")) {
      this.mode = "manual";
      camera.position.add(this.up.clone().multiplyScalar(1));
    }
    if (io.keyIsDown("KeyU")) {
      this.mode = "manual";
      camera.position.add(this.up.clone().multiplyScalar(-1));
    }

    if (io.keyIsDown("KeyI")) {
      this.mode = "manual";
      camera.position.y -= 1.0;
    }
    if (io.keyIsDown("KeyK")) {
      this.mode = "manual";
      camera.position.y += 1.0;
    }
    if (io.keyIsDown("KeyJ")) {
      this.mode = "manual";
      camera.position.x -= 1.0;
    }
    if (io.keyIsDown("KeyL")) {
      this.mode = "manual";
      camera.position.x += 1.0;
    }

    camera.lookAt(this.lookTarget.x, this.lookTarget.y, 0);
    camera.position.add(this.nudgeOffset);
  }

  zoomControls(camera: PerspectiveCamera) {
    const io = this.game!.io;
    if (io.keyIsDown("Equal")) {
      camera.fov *= 0.995;
      camera.updateProjectionMatrix();
    }
    if (io.keyIsDown("Minus")) {
      camera.fov *= 1.005;
      camera.updateProjectionMatrix();
    }
  }

  handlers = {
    nudge: async ({ impulse, duration }: NudgeEvent) => {
      const camera = this.game!.camera;
      const [dx, dy] = impulse.mul(NUDGE_SCALE);
      await this.wait((duration / 2) * NUDGE_DURATION_SCALE, (dt) => {
        this.nudgeOffset.x += dx * dt;
        this.nudgeOffset.y += dy * dt;
      });
      await this.wait((duration / 2) * NUDGE_DURATION_SCALE, (dt) => {
        this.nudgeOffset.x -= dx * dt;
        this.nudgeOffset.y -= dy * dt;
      });
    },
  };
}

function lerpOrJump(
  position: Vector3,
  target: Vector3,
  t: number,
  jumpDist: number = 0.05
) {
  position.lerp(target, t);
  if (position.distanceTo(target) < jumpDist) {
    position.copy(target);
  }
}
