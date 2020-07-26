import { Body, Capsule } from "p2";
import { BoxBufferGeometry, Mesh, MeshStandardMaterial } from "three";
import BaseEntity from "../../../core/entity/BaseEntity";
import Entity from "../../../core/entity/Entity";
import { V2d } from "../../../core/Vector";
import {
  BallCollisionInfo,
  WithBallCollisionInfo,
} from "../../ball/BallCollisionInfo";
import { CollisionGroups } from "../../Collision";
import { TEXTURES } from "../../graphics/textures";
import { P2Materials } from "../P2Materials";
import MultiWall from "./MultiWall";

export const WALL_TOP_MATERIAL = new MeshStandardMaterial({
  color: 0x333333,
  roughness: 0.0,
  metalness: 1.0,
});
export const WALL_SIDE_MATERIAL = new MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.1,
});

export default class Wall extends MultiWall {
  constructor(
    start: V2d,
    end: V2d,
    width?: number,
    color?: number,
    renderSelf?: boolean
  ) {
    super([start, end], width, color, renderSelf);
  }
}
