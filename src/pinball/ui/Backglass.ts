import {
  CanvasTexture,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  MeshBasicMaterial,
  NearestFilter,
  LinearFilter,
  LinearMipMapNearestFilter,
  NearestMipMapNearestFilter,
  MeshPhongMaterial,
} from "three";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { UpdateScoreEvent } from "../LogicBoard";
import { TABLE_ANGLE } from "../Table";
import FPSMeter from "../../core/util/FPSMeter";

interface ScoreEvent {
  type: "score";
  points: number;
}

export default class Backglass extends BaseEntity implements Entity {
  ctx: CanvasRenderingContext2D;
  texture: CanvasTexture;
  fpsMeter: FPSMeter;

  constructor(left: number, right: number, height: number) {
    super();
    this.fpsMeter = this.addChild(new FPSMeter());

    const width = right - left;

    const canvas = document.createElement("canvas");
    canvas.width = width * 16;
    canvas.height = height * 16;

    this.ctx = canvas.getContext("2d")!;
    this.texture = new CanvasTexture(canvas);
    this.texture.anisotropy = 4;
    this.texture.minFilter = LinearFilter;
    this.updateText();

    const material = new MeshPhongMaterial({
      color: 0x000000,
      emissive: 0xffffff,
      emissiveMap: this.texture,
    });

    const x = (left + right) / 2;
    const geometry = new PlaneGeometry(width, height);
    geometry.rotateX(-Math.PI / 2);
    geometry.translate(x, 0, -height / 2);
    this.mesh = new Mesh(geometry, material);
    this.mesh.rotateX(-TABLE_ANGLE);
  }

  handlers = {
    updateScore: ({ score }: UpdateScoreEvent) => {
      this.updateText(score);
    },
  };

  onRender() {}

  updateText(score: number = 0) {
    const ctx = this.ctx;
    const { width: w, height: h } = ctx.canvas;

    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = "#f00";
    ctx.font = "64px DS Digital, sans";

    ctx.textBaseline = "top";
    ctx.textAlign = "right";
    ctx.fillText(`${score}`, w - 10, 10, w - 20);

    const stats = this.fpsMeter;
    ctx.font = "40px DS Digital, sans";
    ctx.textBaseline = "bottom";
    ctx.textAlign = "left";
    ctx.fillText(`fps: ${stats.getFps()}`, 10, h - 120, w - 20);
    ctx.fillText(`${stats.getBodyCount()}`, 10, h - 80, w - 20);
    ctx.fillText(`${stats.getObjCount()}`, 10, h - 40, w - 20);

    this.texture.needsUpdate = true;
  }
}
