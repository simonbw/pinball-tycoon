import { Body, Circle } from "p2";
import { CylinderBufferGeometry, Mesh, MeshStandardMaterial } from "three";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { clamp } from "../../core/util/MathUtil";
import { V2d } from "../../core/Vector";
import { isBall } from "../ball/Ball";
import { playSoundEvent } from "../system/Soundboard";
import { CollisionGroups } from "./Collision";
import { P2Materials } from "./Materials";
import { scoreEvent } from "../system/LogicBoard";

const STRENGTH = 250;
const VELOCITY_MULTIPLIER = 0.2;
const EXPAND_AMOUNT = 0.35;
const ANIMATION_DURATION = 0.08;
const COLOR_1 = 0xffbb00;
const COLOR_2 = 0xdd2200;
const RESAMPLE = 4.0;

const MATERIAL = new MeshStandardMaterial({
  roughness: 0.0,
  color: COLOR_1,
  // emissive: COLOR_2,
});

export default class Bumper extends BaseEntity implements Entity {
  lastHit: number = -Infinity;
  body: Body;

  constructor(position: V2d, size: number = 1.7) {
    super();

    this.body = new Body({
      position: position,
      mass: 0,
    });

    const shape = new Circle({ radius: size * 0.8 });
    shape.material = P2Materials.bumper;
    shape.collisionGroup = CollisionGroups.Table;
    shape.collisionMask = CollisionGroups.Ball;
    this.body.addShape(shape);

    const geometry = new CylinderBufferGeometry(size, size, 3.0, 32, 1);
    geometry.rotateX(Math.PI / 2);
    geometry.translate(0, 0, 1.5);
    this.mesh = new Mesh(geometry, MATERIAL);
    this.mesh.position.set(position.x, position.y, -3.0);

    this.mesh.castShadow = true;
    this.mesh.receiveShadow = false;
  }

  onRender() {
    const animationPercent =
      clamp(this.game!.elapsedTime - this.lastHit, 0, ANIMATION_DURATION) /
      ANIMATION_DURATION;
    const scale = (1 - animationPercent) * EXPAND_AMOUNT + 1;
  }

  onImpact(ball: Entity) {
    if (isBall(ball)) {
      this.game!.dispatch(scoreEvent(700));
      const pan = clamp(this.getPosition()[0] / 30, -0.5, 0.5);
      this.game!.dispatch(playSoundEvent("pop1", { pan }));

      ball.body.velocity[0] *= VELOCITY_MULTIPLIER;
      ball.body.velocity[1] *= VELOCITY_MULTIPLIER;
      const impulse = this.getPosition()
        .sub(ball.getPosition())
        .inormalize()
        .mul(-STRENGTH);
      ball.body.applyImpulse(impulse);

      this.lastHit = this.game!.elapsedTime;
    }
  }
}
