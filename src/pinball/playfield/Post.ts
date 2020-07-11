import { Body, Circle, ContactEquation, Shape } from "p2";
import { CylinderGeometry, Mesh, MeshStandardMaterial } from "three";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { colorFade } from "../../core/util/ColorUtils";
import { clamp } from "../../core/util/MathUtil";
import { Vector } from "../../core/Vector";
import {
  BallCollisionInfo,
  WithBallCollisionInfo,
} from "../ball/BallCollisionInfo";
import { playSoundEvent } from "../Soundboard";
import { isBall } from "../ball/Ball";
import { CollisionGroups } from "./Collision";
import { Materials } from "./Materials";

const MATERIAL = new MeshStandardMaterial({
  roughness: 0,
  metalness: 0.2,
});

export default class Post extends BaseEntity
  implements Entity, WithBallCollisionInfo {
  ballCollisionInfo: BallCollisionInfo;

  constructor(position: Vector, size: number = 0.5, color: number = 0xddddee) {
    super();

    this.body = new Body({
      position: position,
      mass: 0,
    });

    const shape = new Circle({ radius: size });
    shape.material = Materials.bumper;
    shape.collisionGroup = CollisionGroups.Table;
    shape.collisionMask = CollisionGroups.Ball;
    this.body.addShape(shape);

    this.ballCollisionInfo = {
      beginContactSound: "postHit",
      sparkInfo: {
        color: colorFade(color, 0xffff66, 0.5),
        maxBegin: 4,
        minBegin: 0.5,
        maxDuring: 0,
        size: 0.13,
        impactMultiplier: 1.2,
      },
    };

    const geometry = new CylinderGeometry(size, size, 3.0, 32, 1);
    geometry.rotateX(Math.PI / 2);
    this.mesh = new Mesh(geometry, MATERIAL);
    this.mesh.position.set(position.x, position.y, -1.0);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
  }

  onBeginContact(
    ball: Entity,
    _: Shape,
    __: Shape,
    contactEquations: ContactEquation[]
  ) {
    if (isBall(ball)) {
      const eq = contactEquations[0];
      const impact = Math.abs(eq.getVelocityAlongNormal());
      const pan = clamp(ball.getPosition()[0] / 40, -0.5, 0.5);
      const gain = clamp(impact / 50) ** 2;
      this.game!.dispatch(playSoundEvent("postHit", { pan, gain }));
    }
  }
}
