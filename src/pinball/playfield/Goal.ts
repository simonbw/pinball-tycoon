import { Body, Box, Shape } from "p2";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity from "../../core/entity/Entity";
import { V, V2d } from "../../core/Vector";
import {
  BallCollisionInfo,
  WithBallCollisionInfo,
} from "../ball/BallCollisionInfo";
import { scoreEvent } from "../system/LogicBoard";
import { SoundInstance } from "../system/SoundInstance";
import { CollisionGroups } from "./Collision";
import GoalMesh from "./GoalMesh";
import Scoop from "./Scoop";

const CAPTURE_DURATION = 1.5;
const RELEASE_FORCE = 500;
const WALL_WIDTH = 0.5;

export default class Goal extends BaseEntity
  implements Entity, WithBallCollisionInfo {
  sensorShape: Shape;
  cooldown: boolean = false;
  ballCollisionInfo: BallCollisionInfo = {
    beginContactSound: "postHit",
  };

  constructor(
    position: V2d,
    angle: number = 0,
    width = 8.0,
    depth: number = 5.0
  ) {
    super();

    this.body = new Body({ position, angle });

    this.sensorShape = new Box({ width: width * 0.5, height: depth * 0.5 });
    this.sensorShape.collisionGroup = CollisionGroups.Table;
    this.sensorShape.collisionMask = CollisionGroups.Ball;
    this.sensorShape.collisionResponse = false;

    const leftShape = new Box({ width: WALL_WIDTH, height: depth });
    const rightShape = new Box({ width: WALL_WIDTH, height: depth });
    const backShape = new Box({ width: width, height: WALL_WIDTH });

    for (const shape of [leftShape, rightShape, backShape]) {
      shape.collisionGroup = CollisionGroups.Table;
      shape.collisionMask = CollisionGroups.Ball;
    }

    this.body.addShape(this.sensorShape);
    this.body.addShape(leftShape, [-width / 2, 0]);
    this.body.addShape(rightShape, [width / 2, 0]);
    this.body.addShape(backShape, [0, -depth / 2]);

    this.addChild(new GoalMesh(position, angle, width, depth));

    let goalCount = 0;

    this.addChild(
      new Scoop(
        position.add(V(0, -0.2 * depth).irotate(angle)),
        angle,
        width - WALL_WIDTH,
        depth * 0.5,
        CAPTURE_DURATION,
        RELEASE_FORCE,
        () => {
          goalCount += 1;
          this.game!.dispatch(scoreEvent(25000 * Math.min(goalCount, 4)));
          this.game!.dispatch({ type: "goal" });
          this.addChild(new SoundInstance("goal"));
        },
        async () => {
          await this.wait(0.3);
          this.game!.dispatch({ type: "resetDefenders" });
        }
      )
    );
  }
}
