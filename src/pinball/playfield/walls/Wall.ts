import { Body, Capsule } from "p2";
import { BoxBufferGeometry, Mesh, MeshStandardMaterial } from "three";
import BaseEntity from "../../../core/entity/BaseEntity";
import Entity from "../../../core/entity/Entity";
import { V2d } from "../../../core/Vector";
import {
  BallCollisionInfo,
  WithBallCollisionInfo,
} from "../../ball/BallCollisionInfo";
import { CollisionGroups } from "../../Collision";
import { TEXTURES } from "../../graphics/textures";
import { P2Materials } from "../P2Materials";

export const WALL_TOP_MATERIAL = new MeshStandardMaterial({
  color: 0x333333,
  roughness: 0.0,
  metalness: 1.0,
});
export const WALL_SIDE_MATERIAL = new MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.1,
});

export default class Wall extends BaseEntity
  implements Entity, WithBallCollisionInfo {
  tags = ["wall"];
  ballCollisionInfo: BallCollisionInfo = {
    beginContactSound: { name: "wallHit2" },
  };

  constructor(
    start: V2d,
    end: V2d,
    width: number = 1.0,
    color: number = 0x3355ff,
    renderSelf: boolean = true
  ) {
    super();

    const delta = end.sub(start);
    const length = delta.magnitude;
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
    shape.material = P2Materials.plastic;
    shape.collisionGroup = CollisionGroups.Table;
    shape.collisionMask = CollisionGroups.Ball;
    this.body.addShape(shape);

    if (renderSelf) {
      const geometry = new BoxBufferGeometry(length, width, 1 + 2 * width);
      this.mesh = new Mesh(geometry, [WALL_SIDE_MATERIAL, WALL_TOP_MATERIAL]);
      this.mesh.position.set(center.x, center.y, -width);
      this.mesh.rotateZ(delta.angle);
      this.mesh.castShadow = true;
      this.mesh.receiveShadow = false;

      this.mesh.updateMatrix();
      this.mesh.matrixAutoUpdate = false;

      this.disposeables.push(geometry);
    }
  }
}
