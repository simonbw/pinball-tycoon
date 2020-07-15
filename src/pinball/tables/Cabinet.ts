import { MeshStandardMaterial, Object3D } from "three";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import Table from "./Table";

const MATERIAL = new MeshStandardMaterial({
  color: 0x000000,
  roughness: 0.8,
  flatShading: true,
});

export default class PuckMesh extends BaseEntity implements Entity {
  constructor(table: Table) {
    super();
  }
}
