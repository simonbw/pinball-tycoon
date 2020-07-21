import { Material, ContactMaterial } from "p2";

export const P2Materials = {
  ball: new Material(),
  boundary: new Material(),
  bumper: new Material(),
  dropTarget: new Material(),
  flipper: new Material(),
  gate: new Material(),
  plunger: new Material(),
  post: new Material(),
  slingshot: new Material(),
  wall: new Material(),
};

export const ContactMaterials = [
  new ContactMaterial(P2Materials.ball, P2Materials.boundary, {
    restitution: 0.7,
    friction: 0.2,
  }),
  new ContactMaterial(P2Materials.ball, P2Materials.bumper, {
    restitution: 0.05, // because the bumper applies extra power
    friction: 1,
  }),
  new ContactMaterial(P2Materials.ball, P2Materials.dropTarget, {
    restitution: 1.5,
    friction: 1,
  }),
  new ContactMaterial(P2Materials.ball, P2Materials.flipper, {
    restitution: 0.6,
    friction: 4,
    stiffness: 10 ** 8,
  }),
  new ContactMaterial(P2Materials.ball, P2Materials.gate, {
    restitution: 0.01,
    friction: 0.5,
  }),
  new ContactMaterial(P2Materials.ball, P2Materials.plunger, {
    restitution: 0.2,
    friction: 1,
  }),
  new ContactMaterial(P2Materials.ball, P2Materials.post, {
    restitution: 1.0,
    friction: 0.5,
  }),
  new ContactMaterial(P2Materials.ball, P2Materials.slingshot, {
    restitution: 0.05, // because the slingshot applies extra power
    friction: 1,
  }),
  new ContactMaterial(P2Materials.ball, P2Materials.wall, {
    restitution: 0.8,
    friction: 0.7,
  }),
];
