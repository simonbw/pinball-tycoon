import { MeshStandardMaterial } from "three";

export const WALL_TOP_MATERIAL = new MeshStandardMaterial({
  color: 0x333333,
  roughness: 0.0,
  metalness: 1.0,
});
export const WALL_SIDE_MATERIAL = new MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.1,
});
