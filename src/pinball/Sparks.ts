import BaseEntity from "../core/entity/BaseEntity";
import Entity from "../core/entity/Entity";
import { ParticleContainer } from "pixi.js";

export default class Sparks extends BaseEntity implements Entity {
  sprite: ParticleContainer = new ParticleContainer();
}
