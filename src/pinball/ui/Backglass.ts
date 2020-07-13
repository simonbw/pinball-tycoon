import {
  CanvasTexture,
  LinearFilter,
  Mesh,
  MeshPhongMaterial,
  PlaneBufferGeometry,
} from "three";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import FPSMeter from "../../core/util/FPSMeter";
import { UpdateScoreEvent } from "../LogicBoard";
import { TABLE_ANGLE } from "../tables/HockeyTable";

interface ScoreEvent {
  type: "score";
  points: number;
}

export default class Backglass extends BaseEntity implements Entity {
  ctx: CanvasRenderingContext2D;
  texture: CanvasTexture;
  fpsMeter: FPSMeter;
  score: number = 0;

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
    const geometry = new PlaneBufferGeometry(width, height);
    geometry.rotateX(-Math.PI / 2);
    geometry.translate(x, 0, -height / 2);
    this.mesh = new Mesh(geometry, material);
    this.mesh.rotateX(-TABLE_ANGLE);
  }

  handlers = {
    updateScore: ({ score }: UpdateScoreEvent) => {
      this.score = score;
    },
  };

  onRender() {
    this.updateText();
  }

  updateText() {
    const ctx = this.ctx;
    const { width: w, height: h } = ctx.canvas;

    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = "#f00";
    ctx.font = "64px DS Digital, sans";

    ctx.textBaseline = "top";
    ctx.textAlign = "right";
    const scoreText = this.score.toLocaleString(undefined, {
      useGrouping: true,
    });
    ctx.fillText(`${scoreText} pts`, w - 10, 10, w - 20);

    const { fps, bodyCount, renderCount } = this.fpsMeter.getStats();
    ctx.font = "40px DS Digital, sans";
    ctx.textBaseline = "bottom";
    ctx.textAlign = "left";
    ctx.fillText(`fps: ${fps}`, 10, h - 120, w - 20);
    ctx.fillText(`bodies: ${bodyCount}`, 10, h - 80, w - 20);
    ctx.fillText(`draw: ${renderCount}`, 10, h - 40, w - 20);

    this.texture.needsUpdate = true;
  }
}
