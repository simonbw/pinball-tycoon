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
import { UpdateScoreEvent } from "../system/LogicBoard";
import { getBinding } from "./KeyboardBindings";
import { keyCodeToName } from "../../core/io/Keys";
import Table from "../tables/Table";

type DisplayMode = "pre-game" | "midgame" | "post-game";

export default class Backglass extends BaseEntity implements Entity {
  displayMode: DisplayMode = "pre-game";
  ctx: CanvasRenderingContext2D;
  texture: CanvasTexture;
  fpsMeter: FPSMeter;
  score: number = 0;

  constructor(table: Table) {
    super();
    this.fpsMeter = this.addChild(new FPSMeter());

    const width = table.bounds.width;
    const height = 24;

    const canvas = document.createElement("canvas");
    canvas.width = table.bounds.width * 16;
    canvas.height = height * 16;

    this.ctx = canvas.getContext("2d")!;
    this.texture = new CanvasTexture(canvas);
    this.texture.anisotropy = 4;
    this.texture.minFilter = LinearFilter;

    const material = new MeshPhongMaterial({
      color: 0x000000,
      emissive: 0xffffff,
      emissiveMap: this.texture,
    });

    const x = table.bounds.center.x;
    const geometry = new PlaneBufferGeometry(width, height);
    geometry.rotateX(-Math.PI / 2);
    geometry.translate(x, 0, -height / 2);
    this.mesh = new Mesh(geometry, material);
    this.mesh.rotateX(-table.incline);
  }

  handlers = {
    updateScore: ({ score }: UpdateScoreEvent) => {
      this.score = score;
    },

    gameStart: () => (this.displayMode = "midgame"),
    gameOver: () => (this.displayMode = "post-game"),
  };

  onRender() {
    this.renderBack();

    switch (this.displayMode) {
      case "pre-game":
        const startKey = keyCodeToName(getBinding("START_GAME"));
        this.renderMiddleText(`Press ${startKey} to start`);
        break;
      case "midgame":
        this.renderScore();
        break;
      case "post-game":
        this.renderScore();
        this.renderMiddleText("Game Over");
        break;
    }
    this.renderStats();
    this.texture.needsUpdate = true;
  }

  renderBack() {
    const { width, height } = this.ctx.canvas;
    this.ctx.fillStyle = "#111";
    this.ctx.fillRect(0, 0, width, height);
  }

  renderMiddleText(text: string) {
    const { width: w, height: h } = this.ctx.canvas;
    this.ctx.fillStyle = "#f00";
    this.ctx.font = "64px DS Digital, sans-serif";
    this.ctx.textBaseline = "middle";
    this.ctx.textAlign = "center";
    this.ctx.fillText(text, w / 2, h / 2, w - 20);
  }

  renderScore() {
    const { width: w, height: h } = this.ctx.canvas;
    this.ctx.fillStyle = "#f00";
    this.ctx.font = "64px DS Digital, sans-serif";
    this.ctx.textBaseline = "top";
    this.ctx.textAlign = "right";
    const scoreText = this.score.toLocaleString(undefined, {
      useGrouping: true,
    });
    this.ctx.fillText(`${scoreText} pts`, w - 10, 10, w - 20);
  }

  renderStats() {
    const { width: w, height: h } = this.ctx.canvas;
    const {
      fps,
      bodyCount,
      renderCount,
      entityCount,
    } = this.fpsMeter.getStats();

    this.ctx.font = "28px sans-serif";
    this.ctx.textBaseline = "bottom";
    this.ctx.textAlign = "left";
    const spacing = 28;
    this.ctx.fillText(`fps: ${fps}`, 10, h - spacing * 4, w - 20);
    this.ctx.fillText(`entities: ${entityCount}`, 10, h - spacing * 3, w - 20);
    this.ctx.fillText(`bodies: ${bodyCount}`, 10, h - spacing * 2, w - 20);
    this.ctx.fillText(`draw: ${renderCount}`, 10, h - spacing * 1, w - 20);
  }
}
