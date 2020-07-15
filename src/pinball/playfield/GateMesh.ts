import {
  ExtrudeBufferGeometry,
  Mesh,
  MeshPhongMaterial,
  MixOperation,
  Shape as ThreeShape,
  Vector3,
} from "three";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { V2d } from "../../core/Vector";
import Reflector from "../graphics/Reflector";
import Gate from "./Gate";

export default class GateMesh extends BaseEntity implements Entity {
  reflector: Reflector;

  constructor(private gate: Gate, end: V2d, width: number = 0.5) {
    super();

    const pivot = gate.pivot;
    const delta = end.sub(pivot);
    const length = delta.magnitude;

    const shape = new ThreeShape();
    const r = width / 2;
    shape.moveTo(0, -r);
    shape.lineTo(length, -r);
    shape.absarc(length, 0, r, 0, Math.PI / 2, false);
    shape.lineTo(0, r);
    shape.lineTo(0, -r);

    const geometry = new ExtrudeBufferGeometry(shape, {
      bevelEnabled: false,
      depth: 1.5,
    });
    geometry.rotateZ(delta.angle);

    this.reflector = this.addChild(new Reflector());

    const center = pivot.add(delta.mul(0.5));
    const cameraPos = new Vector3(center.x, center.y, -1.0);
    this.reflector.getCameraPosition = () => cameraPos;

    const material = new MeshPhongMaterial({
      color: 0xbbbbbb,
      combine: MixOperation,
      reflectivity: 0.5,
      envMap: this.reflector.envMap,
    });

    this.mesh = new Mesh(geometry, material);
    this.mesh.position.set(pivot.x, pivot.y, -1.0);
    this.mesh.castShadow = false;
    this.mesh.receiveShadow = false;

    this.mesh = new Mesh(geometry, material);
    this.mesh.position.set(pivot.x, pivot.y, -1.5);
    this.mesh.castShadow = false;
    this.mesh.receiveShadow = false;

    this.reflector.parentMesh = this.mesh;

    this.disposeables = [material, geometry];
  }

  onRender() {
    this.mesh!.rotation.z = this.gate.body.angle;
    const gateSpeed = Math.abs(this.gate.body.angularVelocity);

    // this.reflector.cubeCamera.up.set(0, 0, -1);
    // this.reflector.cubeCamera.rotation.z = this.gate.body.angle;
    if (gateSpeed > 0.01) {
      this.reflector.update();
    }
  }
}
