import { Body, Circle } from "p2";
import { CylinderBufferGeometry, Mesh, MeshStandardMaterial } from "three";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { V2d } from "../../core/Vector";
import {
  BallCollisionInfo,
  WithBallCollisionInfo,
} from "../ball/BallCollisionInfo";
import Reflector from "../graphics/Reflector";
import { TEXTURES } from "../graphics/textures";
import { CollisionGroups } from "../Collision";
import { P2Materials } from "./Materials";

export default class Post extends BaseEntity
  implements Entity, WithBallCollisionInfo {
  ballCollisionInfo: BallCollisionInfo;
  reflector: Reflector;

  constructor(position: V2d, radius: number = 0.5, height: number = 2.0) {
    super();

    this.body = new Body({
      position: position,
      mass: 0,
    });

    const p2Shape = new Circle({ radius: radius });
    p2Shape.material = P2Materials.bumper;
    p2Shape.collisionGroup = CollisionGroups.Table;
    p2Shape.collisionMask = CollisionGroups.Ball;
    this.body.addShape(p2Shape);

    this.ballCollisionInfo = {
      beginContactSound: "postHit",
    };

    this.reflector = this.addChild(new Reflector());

    const material = new MeshStandardMaterial({
      color: 0xdddddd,
      metalness: 1.0,
      roughness: 1.5,
      roughnessMap: TEXTURES.IronScuffedRoughness,
      envMap: this.reflector.envMap,
    });

    const geometry = new CylinderBufferGeometry(radius, radius, height);
    geometry.rotateX(Math.PI / 2);
    this.mesh = new Mesh(geometry, material);
    this.mesh.position.set(position.x, position.y, -1.0);
    this.mesh.castShadow = false;
    this.mesh.receiveShadow = false;

    this.reflector.parentMesh = this.mesh;

    this.disposeables.push(material, geometry);
  }
}
