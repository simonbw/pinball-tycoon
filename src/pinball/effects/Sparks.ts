import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { ParticleContainer } from "pixi.js";
import { Vector } from "../../core/Vector";

export default class Sparks extends BaseEntity implements Entity {
  sprite: ParticleContainer = new ParticleContainer();

  constructor(position: Vector) {
    super();
  }
}
