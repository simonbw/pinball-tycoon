import { Mesh, MeshStandardMaterial, SphereBufferGeometry } from "three";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { V, V2d } from "../../core/Vector";
import Reflector from "../graphics/Reflector";
import { TEXTURES } from "../graphics/textures";
import Ball from "./Ball";

export default class BallMesh extends BaseEntity implements Entity {
  mesh: Mesh;
  reflector: Reflector;

  rollingPosition: V2d = V(0, 0);

  constructor(private ball: Ball) {
    super();

    this.reflector = this.addChild(new Reflector());

    const material = new MeshStandardMaterial({
      color: 0xffffff,
      roughness: 1.5,
      metalness: 0.83,
      roughnessMap: TEXTURES.IronScuffedRoughness,
      envMap: this.reflector.envMap,
    });

    const geometry = new SphereBufferGeometry(ball.radius, 16, 16);
    this.mesh = new Mesh(geometry, material);
    this.mesh.castShadow = true;
    this.reflector.parentMesh = this.mesh;

    this.mesh.rotateX(Math.PI);

    this.disposeables.push(material, geometry);
  }

  onTick(dt: number) {
    const m = this.ball.angularMomentum;
    const axis = m.clone().normalize();
    const angle = m.length() * dt;
    this.mesh.rotateOnWorldAxis(axis, angle);
  }

  onRender() {
    const [x, y] = this.ball.getPosition();
    let z = -(this.ball.getHeight() + this.ball.radius);
    if (this.ball.captured) {
      // z += this.ball.radius * 0.5;
    }
    this.mesh.position.set(x, y, z);

    if (this.game!.framenumber % 4 === 1) {
      this.reflector.update();
    }
  }
}
