import {
  Camera,
  Color,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  PCFShadowMap,
  Vector2,
} from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";

export class GameRenderer3d {
  scene: Scene = new Scene();
  camera: Camera;
  threeRenderer: WebGLRenderer;
  composer: EffectComposer;
  readonly domElement: HTMLElement;

  constructor() {
    this.scene = new Scene();
    this.scene.background = new Color(0x222233);

    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new PerspectiveCamera(65, aspect, 0.1, 1000);

    this.threeRenderer = new WebGLRenderer({ alpha: false, antialias: true });
    this.threeRenderer.domElement.style.pointerEvents = "none";
    this.threeRenderer.domElement.style.cursor = "none";
    this.threeRenderer.shadowMap.enabled = false;
    // this.threeRenderer.shadowMap.type = PCFShadowMap;

    this.threeRenderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.threeRenderer.domElement);
    this.domElement = this.threeRenderer.domElement;

    this.composer = new EffectComposer(this.threeRenderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
  }

  render() {
    this.composer.render();
  }
}
