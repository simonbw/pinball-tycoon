import { Body, SAPBroadphase, World } from "p2";
import Ball from "../../pinball/ball/Ball";
import { WithOwner } from "../entity/Entity";

const CUSTOM_BROADPHASE_TYPE = 3;
export default class CustomBroadphase extends SAPBroadphase {
  ballBodies: Set<Body> = new Set();

  constructor() {
    super(CUSTOM_BROADPHASE_TYPE);
  }

  setWorld(world: World) {
    super.setWorld.call(this, world);

    world.on("addBody", ({ body }: { body: Body & WithOwner }) => {
      if (body.type === Body.DYNAMIC && body.owner instanceof Ball) {
        console.log("ball body added", body);
        this.ballBodies.add(body);
      }
    });

    world.on("removeBody", ({ body }: { body: Body & WithOwner }) => {
      if (this.ballBodies.has(body)) {
        console.log("ball body delete", body);
        this.ballBodies.delete(body);
      }
    });
  }

  getCollisionPairs() {
    const result: Body[] = [];
    for (const body of this.ballBodies) {
      this.aabbQuery(this.world, body.getAABB(), result);
    }
    return result;
  }
}
