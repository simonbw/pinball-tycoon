import { Material, ContactMaterial } from "p2";

export const P2Materials = {
  ball: new Material(),
  rubber: new Material(),
  plastic: new Material(),
  metal: new Material(),
  flipper: new Material(),
  plunger: new Material(),
  slingshot: new Material(),
};

export const ContactMaterials = [
  new ContactMaterial(P2Materials.ball, P2Materials.ball, {
    restitution: 0.4,
    friction: 3.0,
    stiffness: 10 ** 7,
  }),
  new ContactMaterial(P2Materials.ball, P2Materials.rubber, {
    restitution: 0.3,
    friction: 3.0,
    stiffness: 2 * 10 ** 7,
  }),
  new ContactMaterial(P2Materials.ball, P2Materials.metal, {
    restitution: 0.25,
    friction: 0.5,
    stiffness: 10 ** 7,
  }),
  new ContactMaterial(P2Materials.ball, P2Materials.plastic, {
    restitution: 0.3,
    friction: 0.7,
    stiffness: 5 * 10 ** 6,
  }),
  new ContactMaterial(P2Materials.ball, P2Materials.flipper, {
    restitution: 0.6,
    friction: 4,
    stiffness: 10 ** 8,
  }),
  new ContactMaterial(P2Materials.ball, P2Materials.plunger, {
    restitution: 0.2,
    friction: 1,
  }),
  new ContactMaterial(P2Materials.ball, P2Materials.slingshot, {
    restitution: 0.8,
    friction: 5,
    stiffness: 10 ** 6,
  }),
];
