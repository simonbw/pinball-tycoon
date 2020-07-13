import {
  CylinderBufferGeometry,
  Mesh,
  MeshStandardMaterial,
  Object3D,
} from "three";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { V, Vector } from "../../core/Vector";
import { TEXTURES } from "../graphics/textures";
import Ball from "./Ball";

const RADIUS = 1.0625; // Radius in half inches
const HEIGHT = RADIUS / 1.5; // Ratio of hockey puck size

const GEOMETRY = new CylinderBufferGeometry(RADIUS, RADIUS, HEIGHT, 32, 1);
GEOMETRY.rotateX(Math.PI / 2);

const roughnessMap = TEXTURES.PlasticScuffedRoughness.clone();
roughnessMap.repeat.set(0.5, 0.5);
roughnessMap.center.set(0.5, 0.5);

const MATERIAL = new MeshStandardMaterial({
  color: 0x111111,
  roughness: 2.0,
  roughnessMap,
});

export default class PuckMesh extends BaseEntity implements Entity {
  ball: Ball;
  mesh: Mesh;
  object3ds: Object3D[] = [];

  rollingVelocity: Vector = V(0, 0);
  rollingPosition: Vector = V(0, 0);

  constructor(ball: Ball) {
    super();

    this.ball = ball;

    this.mesh = new Mesh(GEOMETRY, MATERIAL);
    this.mesh.castShadow = true;
  }

  onRender() {
    const [x, y] = this.ball.body.position;
    const z = -HEIGHT / 2;
    this.mesh.position.set(x, y, z);
  }
}

/** Type guard for ball entity */
export function isBall(e?: Entity): e is Ball {
  return e instanceof Ball;
}
