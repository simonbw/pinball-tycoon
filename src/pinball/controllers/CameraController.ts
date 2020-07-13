import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { KeyCode } from "../../core/io/Keys";
import { lerp } from "../../core/util/MathUtil";
import { V, Vector } from "../../core/Vector";
import { isBall } from "../ball/Ball";
import { NudgeEvent } from "./NudgeController";
import { Camera, Vector3, PerspectiveCamera } from "three";
import Game from "../../core/Game";
import { TABLE_ANGLE } from "../tables/HockeyTable";

const NORMAL_POS = new Vector3(0, 110, -60);

export default class CameraController extends BaseEntity implements Entity {
  tableCenter: Vector3;
  lookTarget: Vector3;

  mode: "normal" | "top" | "manual" = "normal";

  constructor(tableCenter: Vector3) {
    super();
    this.tableCenter = tableCenter.clone();
    this.lookTarget = this.tableCenter.clone();
  }

  onAdd(game: Game) {
    game.camera.position.copy(NORMAL_POS);
  }

  onRender() {
    if (!this.game) return;

    const camera = this.game.camera as PerspectiveCamera;
    this.zoomControls(camera);

    switch (this.mode) {
      case "normal":
        return this.normalMode(camera);
      case "top":
        return this.topMode(camera);
      case "manual":
        return this.manualMode(camera);
    }
  }

  onKeyDown(keyCode: KeyCode) {
    if (keyCode === "KeyY") {
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

  normalMode(camera: Camera) {
    const game = this.game!;

    if (!game.paused) {
      game.camera.position.lerp(NORMAL_POS, 0.1);

      // TODO: Why can't this be a constant?
      const UP = new Vector3(0, 0, -1).applyAxisAngle(
        new Vector3(-1, 0, 0),
        TABLE_ANGLE
      );
      camera.up.copy(UP);
      this.zoomControls(camera as PerspectiveCamera);

      const ball = game.entities.getTagged("ball")[0];
      const t = this.tableCenter;
      if (isBall(ball)) {
        const b = ball.getPosition();
        const l = new Vector3();
        l.x = lerp(t.x, b.x, 0.3);
        l.y = lerp(t.y, b.y, 0.3);
        this.lookTarget.lerp(l, 0.1);
      } else {
        this.lookTarget.lerp(this.tableCenter, 0.01);
      }

      camera.lookAt(this.lookTarget.x, this.lookTarget.y, 0);
    }
  }

  topMode(camera: PerspectiveCamera) {
    if (camera.fov < 56) {
      camera.fov = Math.min(camera.fov + 1, 56);
      camera.updateProjectionMatrix();
    }
    const UP = new Vector3(0, 0, -1).applyAxisAngle(
      new Vector3(-1, 0, 0),
      TABLE_ANGLE
    );
    camera.up.copy(UP);
    camera.position.lerp(
      new Vector3(this.tableCenter.x, this.tableCenter.y, -100),
      0.2
    );
    camera.lookAt(this.tableCenter);
  }

  manualMode(camera: PerspectiveCamera) {
    const io = this.game!.io;
    if (io.keyIsDown("KeyP")) {
      camera.position.add(camera.up);
    }
    if (io.keyIsDown("KeyU")) {
      camera.position.add(camera.up.clone().multiplyScalar(-1));
    }

    if (io.keyIsDown("KeyI")) {
      camera.position.y -= 1.0;
    }
    if (io.keyIsDown("KeyK")) {
      camera.position.y += 1.0;
    }
    if (io.keyIsDown("KeyJ")) {
      camera.position.x -= 1.0;
    }
    if (io.keyIsDown("KeyL")) {
      camera.position.x += 1.0;
    }

    camera.lookAt(this.lookTarget.x, this.lookTarget.y, 0);
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
}
