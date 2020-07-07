import { Material, ContactMaterial } from "p2";

export const Materials = {
  ball: new Material(),
  boundary: new Material(),
  bumper: new Material(),
  flipper: new Material(),
  gate: new Material(),
  plunger: new Material(),
  post: new Material(),
  slingshot: new Material(),
  wall: new Material(),
};

export const ContactMaterials = [
  new ContactMaterial(Materials.ball, Materials.boundary, {
    restitution: 0.7,
    friction: 0.2,
  }),
  new ContactMaterial(Materials.ball, Materials.bumper, {
    restitution: 0.05, // because the bumper applies extra power
    friction: 1,
  }),
  new ContactMaterial(Materials.ball, Materials.flipper, {
    restitution: 0.8,
    friction: 4,
    stiffness: 10 ** 8,
  }),
  new ContactMaterial(Materials.ball, Materials.gate, {
    restitution: 0,
    friction: 0.5,
  }),
  new ContactMaterial(Materials.ball, Materials.plunger, {
    restitution: 0.2,
    friction: 1,
  }),
  new ContactMaterial(Materials.ball, Materials.post, {
    restitution: 0.3,
    friction: 0.5,
  }),
  new ContactMaterial(Materials.ball, Materials.slingshot, {
    restitution: 0.05, // because the slingshot applies extra power
    friction: 1,
  }),
  new ContactMaterial(Materials.ball, Materials.wall, {
    restitution: 0.5,
    friction: 0.7,
  }),
];