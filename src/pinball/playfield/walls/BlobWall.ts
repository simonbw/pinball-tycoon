import { Body } from "p2";
import { ExtrudeBufferGeometry, Matrix3, Mesh, Shape, Vector2 } from "three";
import { WALL_SIDE_MATERIAL, WALL_TOP_MATERIAL } from ".";
import BaseEntity from "../../../core/entity/BaseEntity";
import Entity from "../../../core/entity/Entity";
import { isCCW, pathToPoints } from "../../../core/util/MathUtil";
import {
  BallCollisionInfo,
  WithBallCollisionInfo,
} from "../../ball/BallCollisionInfo";
import { CollisionGroups } from "../../Collision";

const SEGMENTS_PER_HALF_INCH = 1.0;

interface Options {
  color?: number;
  height?: number;
}

export default class BlobWall extends BaseEntity
  implements Entity, WithBallCollisionInfo {
  ballCollisionInfo: BallCollisionInfo = {
    beginContactSound: {
      name: "wallHit2",
    },
  };

  constructor(path: Shape, transform?: Matrix3, { height = 1 }: Options = {}) {
    super();

    const points = pathToPoints(path, transform, SEGMENTS_PER_HALF_INCH);
    const shapeToExtrude = new Shape(points.map(([x, y]) => new Vector2(x, y)));
    const geometry = new ExtrudeBufferGeometry(shapeToExtrude, {
      bevelEnabled: false,
      depth: height,
      curveSegments: 1,
    });
    geometry.translate(0, 0, -height);
    this.mesh = new Mesh(geometry, [WALL_TOP_MATERIAL, WALL_SIDE_MATERIAL]);

    this.disposeables.push(geometry);

    this.body = new Body({ mass: 0 });
    if (!isCCW(points)) {
      points.reverse();
    }

    const success = this.body.fromPolygon(points, {
      optimalDecomp: points.length < 8,
      removeCollinearPoints: 0.001,
      skipSimpleCheck: false,
    });

    if (!success || this.body.getArea() <= 0) {
      console.error("decomposition failed", points);
      throw new Error("decomposition failed");
    }

    for (const shape of this.body.shapes) {
      shape.collisionGroup = CollisionGroups.Table;
      shape.collisionMask = CollisionGroups.Ball;
    }
  }
}
