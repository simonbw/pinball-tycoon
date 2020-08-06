import { Body, Box, Shape } from "p2";
import BaseEntity from "../../../core/entity/BaseEntity";
import Entity from "../../../core/entity/Entity";
import { degToRad } from "../../../core/util/MathUtil";
import { rNormal } from "../../../core/util/Random";
import { V, V2d } from "../../../core/Vector";
import {
  BallCollisionInfo,
  WithBallCollisionInfo,
} from "../../ball/BallCollisionInfo";
import { CollisionGroups } from "../../Collision";
import { SoundInstance } from "../../sound/SoundInstance";
import { scoreEvent } from "../../system/LogicBoard";
import Scoop from "../Scoop";
import GoalMesh from "./GoalMesh";

const CAPTURE_DURATION = 1.5;
const WALL_WIDTH = 0.5;

interface GoalOptions {
  angle?: number;
  width?: number;
  depth?: number;
  releaseAngleOffset?: number;
}
export default class Goal extends BaseEntity
  implements Entity, WithBallCollisionInfo {
  sensorShape: Shape;
  cooldown: boolean = false;
  ballCollisionInfo: BallCollisionInfo = {
    beginContactSound: { name: "postHit" },
  };
  goalCount: number = 0;

  constructor(
    position: V2d,
    angle: number = 0,
    width = 8.0,
    depth: number = 5.0,
    releaseAngleOffset: number = 0
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

    const releaseAngle = angle - releaseAngleOffset;
    this.addChild(
      new Scoop(
        position.add(V(0, -0.2 * depth).irotate(angle)),
        angle,
        width - WALL_WIDTH,
        depth * 0.5,
        CAPTURE_DURATION,
        () => V(0, 450).irotate(releaseAngle + rNormal(0, degToRad(1.5))),
        () => this.onScoop(),
        () => this.onRelease()
      )
    );
  }

  async onScoop() {
    this.game!.dispatch(scoreEvent(25000));
    this.game!.dispatch({ type: "goal" });
    this.addChild(new SoundInstance("goal"));
  }

  async onRelease() {
    await this.wait(0.3);
  }

  handlers = {
    gameStart: () => {
      this.goalCount = 0;
    },
  };
}
