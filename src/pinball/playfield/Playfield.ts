import { Body, Plane } from "p2";
import { Mesh, MeshPhysicalMaterial, PlaneBufferGeometry } from "three";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { V } from "../../core/Vector";
import { TEXTURES } from "../graphics/textures";
import { Rect } from "../Rect";
import { CollisionGroups } from "./Collision";
import { P2Materials } from "./Materials";

const MATERIAL = new MeshPhysicalMaterial({
  color: 0xffffff,
  emissive: 0x000011,

  map: TEXTURES.PlasticScuffed,
  roughness: 0.7,
  normalMap: TEXTURES.PlasticScuffedNormal,

  clearcoat: 0.3,
  clearcoatRoughness: 0.8,
  clearcoatRoughnessMap: TEXTURES.PlasticScuffedRoughness,
});

// const MATERIAL = new MeshPhongMaterial({
//   color: 0xffffff,
// });

/**
 * The main boundary of the game, makes sure the ball can't possibly be in weird places.
 */
export default class Playfield extends BaseEntity implements Entity {
  constructor({ top, bottom, left, right }: Rect) {
    super();

    this.body = new Body({
      mass: 0,
    });

    // Bound the ball to the playfield
    // Maybe not actually necessary, but helps avoid rare cases
    this.body.addShape(makeP2Plane(), [0, top]); // Top
    this.body.addShape(makeP2Plane(), [0, bottom], Math.PI); // Bottom
    this.body.addShape(makeP2Plane(), [left, 0], -Math.PI / 2); // Left
    this.body.addShape(makeP2Plane(), [right, 0], Math.PI / 2); // Right

    const width = right - left;
    const height = bottom - top;
    const geometry = new PlaneBufferGeometry(width, height, 200, 200);

    geometry.rotateX(Math.PI);

    const [cx, cy] = V(left, top).iadd([right, bottom]).imul(0.5);
    this.mesh = new Mesh(geometry, MATERIAL);
    this.mesh.position.set(cx, cy, 0);
    this.mesh.receiveShadow = true;
  }
}

function makeP2Plane() {
  const shape = new Plane({});
  shape.material = P2Materials.boundary;
  shape.collisionGroup = CollisionGroups.Table;
  shape.collisionMask = CollisionGroups.Ball;
  return shape;
}
