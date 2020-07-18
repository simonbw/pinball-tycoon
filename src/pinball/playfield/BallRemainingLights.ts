import {
  AdditiveBlending,
  CircleBufferGeometry,
  Color,
  Mesh,
  MeshPhongMaterial,
  PointLight,
  Sprite,
  SpriteMaterial,
} from "three";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { getGraphicsQuality } from "../controllers/GraphicsQualityController";
import { createRadialGradient } from "../graphics/proceduralTextures";
import { BallsRemainingEvent } from "../system/LogicBoard";
import Playfield from "./Playfield";

const LIT_EMISSIVE = new Color(1024, 0, 0);
const UNLIT_EMISSIVE = new Color(0x000000);

const spriteTexture = createRadialGradient(64);
const spriteMaterial = new SpriteMaterial({
  blending: AdditiveBlending,
  color: 0x440000,
  map: spriteTexture,
  opacity: 0.5,
  premultipliedAlpha: true,
  transparent: true,
  polygonOffset: true,
  polygonOffsetFactor: -0.5,
});

export default class BallRemainingLights extends BaseEntity implements Entity {
  material: MeshPhongMaterial;
  glow: Sprite;
  constructor(
    playfield: Playfield,
    [x, y]: [number, number],
    private n: number
  ) {
    super();

    this.material = new MeshPhongMaterial({
      // transparent: true,
      color: 0x330000,
      depthTest: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -0.3,
      shininess: 30,
      specular: 0x444444,
      wireframe: false,
      emissive: UNLIT_EMISSIVE,
    });

    const geometry = new CircleBufferGeometry(0.6, 32);
    this.mesh = new Mesh(geometry, this.material);
    this.mesh.rotateX(Math.PI);
    this.mesh.position.set(x, y, 0);

    this.glow = new Sprite(spriteMaterial);
    this.glow.scale.set(5, 5, 0);
    this.glow.position.set(x, y, -0.2);
    this.object3ds.push(this.glow);
    this.unlight();

    this.disposeables = [geometry, this.material];
  }

  light() {
    this.material.emissive = LIT_EMISSIVE;
    this.material.needsUpdate = true;
    this.glow.visible = true;
  }

  unlight() {
    this.material.emissive = UNLIT_EMISSIVE;
    this.material.needsUpdate = true;
    this.glow.visible = false;
  }

  handlers = {
    ballsRemaining: ({ ballsRemaining }: BallsRemainingEvent) => {
      console.log(ballsRemaining);
      if (ballsRemaining >= this.n) {
        this.light();
      } else {
        this.unlight();
      }
    },
  };
}
