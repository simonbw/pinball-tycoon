import { Body, Plane } from "p2";
import { Mesh, MeshPhysicalMaterial, PlaneBufferGeometry } from "three";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { V } from "../../core/Vector";
import { TEXTURES } from "../graphics/textures";
import { Rect } from "../util/Rect";
import { CollisionGroups } from "../Collision";
import { P2Materials } from "./Materials";

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

    const material = new MeshPhysicalMaterial({
      color: 0xffffff,
      emissive: 0x111126,

      map: TEXTURES.HockeyPlayfield,
      roughness: 0.8,
      normalMap: TEXTURES.PlasticScuffedNormal,

      // depthWrite: false, // Helps with glowing lights

      clearcoat: 0.5,
      clearcoatRoughness: 0.8,
      clearcoatRoughnessMap: TEXTURES.PlasticScuffedRoughness,
    });

    const width = right - left;
    const height = bottom - top;
    const geometry = new PlaneBufferGeometry(width, height, 1, 1);

    geometry.rotateX(Math.PI);

    const [cx, cy] = V(left, top).iadd([right, bottom]).imul(0.5);
    this.mesh = new Mesh(geometry, material);
    this.mesh.position.set(cx, cy, 0);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    this.disposeables.push(material, geometry);
  }
}

function makeP2Plane() {
  const shape = new Plane({});
  shape.material = P2Materials.boundary;
  shape.collisionGroup = CollisionGroups.Table;
  shape.collisionMask = CollisionGroups.Ball;
  return shape;
}
