import { Body, Plane } from "p2";
import { Graphics } from "pixi.js";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity, { GameSprite } from "../../core/entity/Entity";
import { CollisionGroups } from "./Collision";
import { Materials } from "./Materials";
import { LAYERS } from "../layers";

/**
 * The main boundary of the game, makes sure the ball can't possibly be in weird places.
 */
export default class Boundary extends BaseEntity implements Entity {
  sprite: Graphics & GameSprite = new Graphics();

  constructor(top: number, bottom: number, left: number, right: number) {
    super();

    const graphics = new Graphics();
    graphics.beginFill(0x444455, 1);
    graphics.drawRect(left, top, right - left, bottom - top);
    graphics.endFill();
    this.sprite = graphics;
    this.sprite.layerName = LAYERS.mainfield_bottom;

    this.body = new Body({
      mass: 0,
    });

    this.body.addShape(makePlane(), [0, top]); // Top
    this.body.addShape(makePlane(), [0, bottom], Math.PI); // Bottom
    this.body.addShape(makePlane(), [left, 0], -Math.PI / 2); // Left
    this.body.addShape(makePlane(), [right, 0], Math.PI / 2); // Right
  }
}

function makePlane() {
  const shape = new Plane({});
  shape.material = Materials.boundary;
  shape.collisionGroup = CollisionGroups.Table;
  shape.collisionMask = CollisionGroups.Ball;
  return shape;
}
