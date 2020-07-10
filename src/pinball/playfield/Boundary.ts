import { Body, Plane } from "p2";
import { Mesh, MeshPhysicalMaterial, PlaneGeometry } from "three";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { V } from "../../core/Vector";
import { TEXTURES } from "../graphics/textures";
import { Rect } from "../Rect";
import { CollisionGroups } from "./Collision";
import { Materials } from "./Materials";

const MATERIAL = new MeshPhysicalMaterial({
  roughness: 0.1,
  metalness: 0.0,
  map: TEXTURES.Wood,
  roughnessMap: TEXTURES.Wood,
});

/**
 * The main boundary of the game, makes sure the ball can't possibly be in weird places.
 */
export default class Boundary extends BaseEntity implements Entity {
  constructor({ top, bottom, left, right }: Rect) {
    super();

    this.body = new Body({
      mass: 0,
    });

    this.body.addShape(makeP2Plane(), [0, top]); // Top
    this.body.addShape(makeP2Plane(), [0, bottom], Math.PI); // Bottom
    this.body.addShape(makeP2Plane(), [left, 0], -Math.PI / 2); // Left
    this.body.addShape(makeP2Plane(), [right, 0], Math.PI / 2); // Right

    const width = right - left;
    const height = bottom - top;
    const [cx, cy] = V(left, top).iadd([right, bottom]).imul(0.5);
    const geometry = new PlaneGeometry(width, height, 10);
    geometry.rotateX(Math.PI);
    this.mesh = new Mesh(geometry, MATERIAL);
    this.mesh.position.set(cx, cy, 0);
    this.mesh.receiveShadow = true;
  }
}

function makeP2Plane() {
  const shape = new Plane({});
  shape.material = Materials.boundary;
  shape.collisionGroup = CollisionGroups.Table;
  shape.collisionMask = CollisionGroups.Ball;
  return shape;
}
