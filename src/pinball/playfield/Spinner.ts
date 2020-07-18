import { Body, Box } from "p2";
import {
  BoxBufferGeometry,
  Mesh,
  MeshPhongMaterial,
  Vector3,
  MeshStandardMaterial,
} from "three";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { V, V2d } from "../../core/Vector";
import { isBall } from "../ball/Ball";
import { CollisionGroups } from "./Collision";
import { scoreEvent } from "../system/LogicBoard";
import { PositionalSound } from "../system/PositionalSound";
import { rNormal } from "../../core/util/Random";
import { clamp } from "../../core/util/MathUtil";
import {
  WithBallCollisionInfo,
  BallCollisionInfo,
} from "../ball/BallCollisionInfo";
import Reflector from "../graphics/Reflector";

const FRICTION = 1.2;
const SPEED_MULTI = 0.2;

export default class Spinner extends BaseEntity
  implements Entity, WithBallCollisionInfo {
  spinVelocity: number = 0;
  spinAngle: number = 0;
  body: Body;
  ballCollisionInfo: BallCollisionInfo = {
    beginContactSound: "gateHit",
  };

  constructor(position: V2d, angle: number = 0, public width: number = 2.0) {
    super();

    this.body = new Body({ collisionResponse: false, angle, position });
    this.body.addShape(new Box({ width: width, height: 1.0 }));
    this.body.shapes[0].collisionGroup = CollisionGroups.Table;
    this.body.shapes[0].collisionMask = CollisionGroups.Ball;

    this.addChild(new SpinnerMesh(this));
  }

  onContacting(ball: Entity) {
    if (isBall(ball)) {
      const relativeVelocity = this.getNormal().dot(ball.body.velocity);
      this.spinVelocity = relativeVelocity * SPEED_MULTI;
    }
  }

  getNormal() {
    return V(0, 1).irotate(this.body!.angle);
  }

  onTick(dt: number) {
    this.spinVelocity *= 1.0 - FRICTION * dt;
    const oldSpinCount = Math.floor(this.spinAngle * 2);
    this.spinAngle += this.spinVelocity * dt;
    const newSpinCount = Math.floor(this.spinAngle * 2);

    for (let i = oldSpinCount; i < newSpinCount; i++) {
      this.onSpin(true);
    }
    for (let i = oldSpinCount; i > newSpinCount; i--) {
      this.onSpin(false);
    }
  }

  onSpin(forward: boolean) {
    const speed = Math.abs(this.spinVelocity);
    this.addChild(
      new PositionalSound("pop1", this.getPosition(), {
        speed: 1.6 + speed * 0.023,
        gain: 0.5,
      })
    );
    this.game!.dispatch(scoreEvent(100));
  }
}

class SpinnerMesh extends BaseEntity implements Entity {
  reflector: Reflector;
  constructor(private spinner: Spinner) {
    super();

    this.reflector = this.addChild(new Reflector(16, 8));

    const height = 1.6;
    const material = new MeshStandardMaterial({
      color: 0xffffff,
      envMap: this.reflector.envMap,
      metalness: 0.8,
      roughness: 0.0,
    });
    const geometry = new BoxBufferGeometry(spinner.width, height, 0.2);
    geometry.rotateZ(spinner.body.angle);
    this.mesh = new Mesh(geometry, material);

    const [x, y] = spinner.body.position;
    this.mesh.position.set(x, y, -height - 0.2);
    this.mesh.up.set(0, 0, -1);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = false;

    this.reflector.parentMesh = this.mesh;
  }

  onRender() {
    const [nx, ny] = this.spinner.getNormal().irotate90cw();
    const axis = new Vector3(nx, ny, 0);
    const angle = -this.spinner.spinAngle * Math.PI * 2 + Math.PI / 2;
    this.mesh!.setRotationFromAxisAngle(axis, angle);

    // this.reflector.update();
  }
}
