import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import {
  generateTextureData,
  createRadialGradient,
} from "./proceduralTextures";
import { SpriteMaterial, Sprite } from "three";

const texture = createRadialGradient(64);

export default class GlowSprite extends BaseEntity implements Entity {
  constructor() {
    super();
  }
}
