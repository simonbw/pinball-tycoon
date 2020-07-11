import { Body, Capsule } from "p2";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { colorFade } from "../../core/util/ColorUtils";
import { Vector } from "../../core/Vector";
import { BallCollisionInfo, WithBallCollisionInfo } from "../BallCollisionInfo";
import { CollisionGroups } from "./Collision";
import { Materials } from "./Materials";
import {
  MeshStandardMaterial,
  BoxGeometry,
  Mesh,
  MeshToonMaterial,
} from "three";
import { TEXTURES } from "../graphics/textures";

export const WALL_MATERIAL = new MeshStandardMaterial({
  // color: 0xffffff,
  roughness: 2.0,
  metalness: 0.2,
  roughnessMap: TEXTURES.Wood,
  map: TEXTURES.Wood,
});

export default class Wall extends BaseEntity
  implements Entity, WithBallCollisionInfo {
  tags = ["wall"];
  ballCollisionInfo: BallCollisionInfo;

  constructor(
    start: Vector,
    end: Vector,
    width: number = 1.0,
    color: number = 0x3355ff,
    renderSelf: boolean = true
  ) {
    super();

    const delta = end.sub(start);
    const length = delta.magnitude;
    const angle = delta.angle;
    const center = start.add(delta.mul(0.5));

    this.body = new Body({
      position: center,
      angle: delta.angle,
      mass: 0,
    });

    const shape = new Capsule({
      length,
      radius: width / 2,
    });
    shape.material = Materials.wall;
    shape.collisionGroup = CollisionGroups.Table;
    shape.collisionMask = CollisionGroups.Ball;
    this.body.addShape(shape);

    this.ballCollisionInfo = {
      beginContactSound: "wallHit1",
      sparkInfo: {
        color: colorFade(color, 0xffffff, 0.5),
        maxBegin: 3,
        maxDuring: 1,
        minDuring: 0,
        impactMultiplier: 1,
        size: 0.15,
      },
    };

    const geometry = new BoxGeometry(length, width, 1 + 2 * width);
    this.mesh = new Mesh(geometry, WALL_MATERIAL);
    this.mesh.position.set(center.x, center.y, -width);
    this.mesh.rotateZ(delta.angle);

    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
  }
}
