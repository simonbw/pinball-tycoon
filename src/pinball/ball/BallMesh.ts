import {
  CubeCamera,
  Material,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  SphereGeometry,
  WebGLCubeRenderTarget,
} from "three";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { degToRad } from "../../core/util/MathUtil";
import { V, Vector } from "../../core/Vector";
import { TEXTURES } from "../graphics/textures";
import Ball from "./Ball";

const RADIUS = 1.0625; // Radius in half inches

const GEOMETRY = new SphereGeometry(RADIUS, 32, 32);

export default class BallMesh extends BaseEntity implements Entity {
  ball: Ball;
  mesh: Mesh;
  material: Material;
  cubeCamera: CubeCamera;
  object3ds: Object3D[] = [];

  rollingVelocity: Vector = V(0, 0);
  rollingPosition: Vector = V(0, 0);

  constructor(ball: Ball) {
    super();

    this.ball = ball;
    const renderTarget = new WebGLCubeRenderTarget(64);
    this.cubeCamera = new CubeCamera(0.1, 3, renderTarget);

    this.object3ds.push(this.cubeCamera);

    this.material = new MeshStandardMaterial({
      color: 0xdddddd,
      roughness: 1.2,
      metalness: 0.8,
      roughnessMap: TEXTURES.IronScuffedRoughness,
      envMap: renderTarget.texture,
    });

    this.mesh = new Mesh(GEOMETRY, this.material);
    this.mesh.castShadow = true;
  }

  onAdd() {
    this.updateReflection();
  }

  onRender() {
    const [x, y] = this.ball.body.position;
    const z = this.ball.getZ();
    this.mesh.position.set(x, y, -z);
    if (this.game!.framenumber % 4 === 1) {
      this.updateReflection();
    }
  }

  updateReflection() {
    const oldVisible = this.mesh.visible;
    this.mesh.visible = false;
    const { threeRenderer, scene } = this.game!.renderer;
    this.cubeCamera.position.copy(this.mesh.position);
    this.cubeCamera.update(threeRenderer, scene);
    this.mesh.visible = oldVisible;
  }

  onDestroy() {
    this.material.dispose();
  }
}

/** Type guard for ball entity */
export function isBall(e?: Entity): e is Ball {
  return e instanceof Ball;
}
