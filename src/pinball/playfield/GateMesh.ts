import {
  ExtrudeBufferGeometry,
  Mesh,
  MeshPhongMaterial,
  MixOperation,
  Shape as ThreeShape,
  Vector3,
  BoxBufferGeometry,
} from "three";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { V2d } from "../../core/Vector";
import Reflector from "../graphics/Reflector";
import Gate from "./Gate";

export default class GateMesh extends BaseEntity implements Entity {
  reflector: Reflector;

  constructor(private gate: Gate, end: V2d, width: number = 0.25) {
    super();

    const pivot = gate.pivot;
    const delta = end.sub(pivot);
    const length = delta.magnitude;

    const geometry = new BoxBufferGeometry(length, width, 1.5);
    geometry.translate(length / 2, 0, 0);
    geometry.rotateZ(delta.angle);

    this.reflector = this.addChild(new Reflector());

    this.reflector.getCameraPosition = () =>
      new Vector3(gate.body.position[0], gate.body.position[1], -1.0);

    const material = new MeshPhongMaterial({
      color: 0xbbbbbb,
      combine: MixOperation,
      reflectivity: 0.7,
      shininess: 32,
      envMap: this.reflector.envMap,
    });

    this.mesh = new Mesh(geometry, material);
    this.mesh.position.set(pivot.x, pivot.y, -1.0);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = false;

    this.reflector.parentMesh = this.mesh;

    this.disposeables = [material, geometry];
  }

  onRender() {
    this.mesh!.rotation.z = this.gate.body.angle;
    const gateSpeed = Math.abs(this.gate.body.angularVelocity);

    if (gateSpeed > 0.01) {
      this.reflector.cubeCamera.rotation.z = this.gate.body.angle;
      this.reflector.update();
    }
  }
}
