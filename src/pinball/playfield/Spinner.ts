import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { V2d } from "../../core/Vector";
import { BoxBufferGeometry, MeshBasicMaterial, Mesh } from "three";

export default class Spinner extends BaseEntity implements Entity {
  constructor(
    public position: V2d,
    public angle: number = 0,
    private width: number = 1.2
  ) {
    super();

    this.addChild(new SpinnerMesh(this));
  }
}

class SpinnerMesh extends BaseEntity implements Entity {
  constructor(spinner: Spinner) {
    super();

    const material = new MeshBasicMaterial();
    const geometry = new BoxBufferGeometry(1.2, 1.0, 0.2);
    this.mesh = new Mesh(geometry, material);

    const [x, y] = spinner.position;
    this.mesh.position.set(x, y, -1.2);
    this.mesh.rotateZ(spinner.angle);
  }
}
