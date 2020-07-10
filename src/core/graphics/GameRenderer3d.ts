import {
  Camera,
  Color,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  PCFShadowMap,
} from "three";

export class GameRenderer3d {
  scene: Scene = new Scene();
  camera: Camera;
  threeRenderer: WebGLRenderer;

  constructor() {
    this.scene = new Scene();
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new PerspectiveCamera(65, aspect, 0.1, 1000);
    this.threeRenderer = new WebGLRenderer({
      alpha: false,
      antialias: true,
    });
    this.threeRenderer.domElement.style.pointerEvents = "none";
    this.threeRenderer.shadowMap.enabled = true;
    this.threeRenderer.shadowMap.type = PCFShadowMap;

    this.scene.background = new Color(0x222233);

    this.threeRenderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.threeRenderer.domElement);
  }

  render() {
    this.threeRenderer.render(this.scene, this.camera);
  }
}
