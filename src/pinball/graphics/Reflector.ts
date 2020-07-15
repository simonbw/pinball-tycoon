import { CubeCamera, Object3D, WebGLCubeRenderTarget, Vector3 } from "three";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";

export default class Reflector extends BaseEntity implements Entity {
  cubeCamera: CubeCamera;
  public parentMesh?: Object3D;
  public getCameraPosition?: () => Vector3;

  constructor(quality: number = 32) {
    super();
    const renderTarget = new WebGLCubeRenderTarget(quality);
    this.cubeCamera = new CubeCamera(0.1, 10, renderTarget);
    this.object3ds.push(this.cubeCamera);

    this.disposeables = [renderTarget];
  }

  handlers = {
    envUpdated: () => this.update(),
  };

  onAdd() {
    this.update();
  }

  get envMap() {
    return this.cubeCamera.renderTarget.texture;
  }

  update() {
    if (this.parentMesh) {
      const oldVisible = this.parentMesh.visible;
      this.parentMesh.visible = false;
      const { threeRenderer, scene } = this.game!.renderer;
      if (this.getCameraPosition) {
        this.cubeCamera.position.copy(this.getCameraPosition());
      } else {
        this.cubeCamera.position.copy(this.parentMesh.position);
      }
      this.cubeCamera.update(threeRenderer, scene);
      this.parentMesh.visible = oldVisible;
    }
  }
}
