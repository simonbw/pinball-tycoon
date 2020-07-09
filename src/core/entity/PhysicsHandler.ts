import Entity from "./Entity";
import { Shape, ContactEquation } from "p2";

export default interface PhysicsHandler {
  // Called when a physics contact starts
  onBeginContact?(
    other?: Entity,
    thisShape?: Shape,
    otherShape?: Shape,
    contactEquations?: ContactEquation[]
  ): void;
  // Called when a physics contact ends
  onEndContact?(other?: Entity, thisShape?: Shape, otherShape?: Shape): void;
  // Called every after the physics step
  onContacting?(
    other?: Entity,
    thisShape?: Shape,
    otherShape?: Shape,
    contactEquations?: ContactEquation[]
  ): void;
  // Called when a physics impact happens
  onImpact?(other?: Entity): void;
}
