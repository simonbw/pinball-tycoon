import { matches } from "hast-util-select";
import { HastSvgElementNode } from "svg-parser";
import { Matrix3, Path, Vector2 } from "three";
import Entity from "../../../core/entity/Entity";
import OverheadLight from "../../playfield/OverheadLight";
import Bumper from "../../playfield/Bumper";
import MultiWall from "../../playfield/walls/MultiWall";
import Plunger from "../../playfield/Plunger";
import {
  getNumberProp,
  parsePointString,
  parseStyle,
  transformPoint,
  getAngle,
  svgArcToShapeArc,
} from "./svgUtils";
import Goal from "../../playfield/Goal";
import Defender from "../../playfield/Defender";
import Goalie from "../../playfield/Goalie";
import Post from "../../playfield/Post";
import Slingshot from "../../playfield/Slingshot";
import Spinner from "../../playfield/Spinner";
import Flipper from "../../playfield/Flipper";
import Drain from "../../playfield/Drain";
import { Rect } from "../../util/Rect";
import Magnet from "../../playfield/Magnet";
import MagnetOrbiter from "../../playfield/MagnetOrbiter";

import { pathParse } from "svg-path-parse";
import PathWall from "../../playfield/walls/PathWall";
import Gate from "../../playfield/Gate";
import { degToRad } from "../../../core/util/MathUtil";

export type Extractor = (
  node: SVGElement,
  transform: Matrix3
) => Entity | undefined | void;

export function getExtractors() {
  const extractors: Extractor[] = [
    // Multiwall
    (node, m) => {
      if (node.matches("polyline")) {
        const pointsStr = node.getAttribute("points")!;
        const points = parsePointString(pointsStr).map(([x, y]) =>
          transformPoint(x, y, m)
        );
        if (points.length < 2) {
          console.warn("single point polyline:", node);
          return;
        }
        const width = getNumberProp(node.style.strokeWidth, 1.0);
        return new MultiWall(points, width);
      }
    },

    // Curve Wall
    (node, m) => {
      if (node.matches("path")) {
        const pathString = node.getAttribute("d") ?? "";
        const parseResult = pathParse(pathString).absNormalize();
        if (parseResult.err) {
          console.warn(parseResult.err);
          return;
        }
        const shapePath = new Path();
        for (const { type, args } of parseResult.segments) {
          switch (type) {
            case "M": {
              shapePath.moveTo(args[0], args[1]);
              break;
            }
            case "L": {
              shapePath.lineTo(args[0], args[1]);
              break;
            }
            case "H": {
              shapePath.lineTo(args[0], shapePath.currentPoint.y);
              break;
            }
            case "V": {
              shapePath.lineTo(shapePath.currentPoint.x, args[0]);
              break;
            }
            case "C": {
              const [x1, y1, x2, y2, x, y] = args;
              shapePath.bezierCurveTo(x1, y1, x2, y2, x, y);
              break;
            }
            case "S": {
              console.warn("TODO: S curve");
              break;
            }
            case "Q":
              shapePath.quadraticCurveTo(args[0], args[1], args[2], args[3]);
              break;
            case "T": {
              console.warn("TODO: T curve");
              break;
            }
            case "A": {
              console.warn("TODO: A curve");
              const [rx, ry, angle, largeFlag, sweepFlag, x, y] = args;
              svgArcToShapeArc(
                shapePath,
                rx,
                ry,
                angle,
                largeFlag,
                sweepFlag,
                shapePath.currentPoint.clone(),
                new Vector2(x, y)
              );
              break;
            }
            case "Z": {
              shapePath.closePath();
              break;
            }
          }
        }
        const width = getNumberProp(node.style.strokeWidth, 1.0);
        return new PathWall(shapePath, 50, width, m);
      }
    },

    // TODO: Curve walls

    // Bumper
    (node, m) => {
      if (node.matches("circle.bumper")) {
        const x = getNumberProp(node.getAttribute("cx"));
        const y = getNumberProp(node.getAttribute("cy"));
        const r = getNumberProp(node.getAttribute("r"), undefined);

        return new Bumper(transformPoint(x, y, m), r);
      }
    },

    // Post
    (node, m) => {
      if (node.matches("circle.post")) {
        const x = getNumberProp(node.getAttribute("cx"));
        const y = getNumberProp(node.getAttribute("cy"));
        const r = getNumberProp(node.getAttribute("r"), undefined);

        return new Post(transformPoint(x, y, m), r);
      }
    },

    // Lights
    (node, m) => {
      if (node.matches("circle.light")) {
        const x = getNumberProp(node.getAttribute("cx"));
        const y = getNumberProp(node.getAttribute("cy"));

        return new OverheadLight(transformPoint(x, y, m));
      }
    },

    // plunger
    (node, m) => {
      if (node.matches("circle.plunger")) {
        const x = getNumberProp(node.getAttribute("cx"));
        const y = getNumberProp(node.getAttribute("cy"));
        const r = getNumberProp(node.getAttribute("r"));
        return new Plunger(transformPoint(x, y, m), r * 2);
      }
    },

    // magnet
    (node, m) => {
      if (node.matches("circle.magnet")) {
        const x = getNumberProp(node.getAttribute("cx"));
        const y = getNumberProp(node.getAttribute("cy"));
        const r = getNumberProp(node.getAttribute("r"));
        return new Magnet(transformPoint(x, y, m), r);
      }
    },

    // magnet
    (node, m) => {
      if (node.matches("circle.orbiter")) {
        const x = getNumberProp(node.getAttribute("cx"));
        const y = getNumberProp(node.getAttribute("cy"));
        const r = getNumberProp(node.getAttribute("r"));
        const speed =
          getNumberProp(node.getAttribute("data-speed")) || undefined;
        return new MagnetOrbiter(transformPoint(x, y, m), r, speed);
      }
    },

    // goal
    (node, m) => {
      if (node.matches("rect.goal")) {
        const left = getNumberProp(node.getAttribute("x"));
        const top = getNumberProp(node.getAttribute("y"));
        const width = getNumberProp(node.getAttribute("width"));
        const height = getNumberProp(node.getAttribute("height"));
        const angle = getAngle(m);
        const x = left + width / 2;
        const y = top + height / 2;
        // TODO: transform width & height
        return new Goal(transformPoint(x, y, m), angle, width, height);
      }
    },

    // defender
    (node, m) => {
      if (node.matches("line.defender")) {
        const x1 = getNumberProp(node.getAttribute("x1"));
        const y1 = getNumberProp(node.getAttribute("y1"));
        const x2 = getNumberProp(node.getAttribute("x2"));
        const y2 = getNumberProp(node.getAttribute("y2"));
        const a = transformPoint(x1, y1, m);
        const b = transformPoint(x2, y2, m);
        const center = a.add(b).imul(0.5);
        const delta = b.sub(a);
        return new Defender(center, delta.angle);
      }
    },

    // goalie
    (node, m) => {
      if (node.matches("line.goalie")) {
        const x1 = getNumberProp(node.getAttribute("x1"));
        const y1 = getNumberProp(node.getAttribute("y1"));
        const x2 = getNumberProp(node.getAttribute("x2"));
        const y2 = getNumberProp(node.getAttribute("y2"));
        const start = transformPoint(x1, y1, m);
        const end = transformPoint(x2, y2, m);
        return new Goalie(start, end);
      }
    },

    // slingshot
    (node, m) => {
      if (node.matches("line.slingshot")) {
        const x1 = getNumberProp(node.getAttribute("x1"));
        const y1 = getNumberProp(node.getAttribute("y1"));
        const x2 = getNumberProp(node.getAttribute("x2"));
        const y2 = getNumberProp(node.getAttribute("y2"));
        const a = transformPoint(x1, y1, m);
        const b = transformPoint(x2, y2, m);
        return new Slingshot(a, b);
      }
    },

    // spinner
    (node, m) => {
      if (node.matches("line.spinner")) {
        const x1 = getNumberProp(node.getAttribute("x1"));
        const y1 = getNumberProp(node.getAttribute("y1"));
        const x2 = getNumberProp(node.getAttribute("x2"));
        const y2 = getNumberProp(node.getAttribute("y2"));
        const a = transformPoint(x1, y1, m);
        const b = transformPoint(x2, y2, m);
        const center = a.add(b).imul(0.5);
        const delta = b.sub(a);
        return new Spinner(center, delta.angle, delta.magnitude);
      }
    },

    // spinner
    (node, m) => {
      if (node.matches("line.gate")) {
        console.log("gate", node);
        const x1 = getNumberProp(node.getAttribute("x1"));
        const y1 = getNumberProp(node.getAttribute("y1"));
        const x2 = getNumberProp(node.getAttribute("x2"));
        const y2 = getNumberProp(node.getAttribute("y2"));
        const a = transformPoint(x1, y1, m);
        const b = transformPoint(x2, y2, m);
        const swingAmount = degToRad(
          getNumberProp(node.getAttribute("data-swing"), 180)
        );
        return new Gate(a, b, swingAmount);
      }
    },

    // flipper
    (node, m) => {
      if (node.matches("line.flipper")) {
        const x1 = getNumberProp(node.getAttribute("x1"));
        const y1 = getNumberProp(node.getAttribute("y1"));
        const x2 = getNumberProp(node.getAttribute("x2"));
        const y2 = getNumberProp(node.getAttribute("y2"));
        const a = transformPoint(x1, y1, m);
        const b = transformPoint(x2, y2, m);
        const delta = b.sub(a);
        const side = a.x < b.x ? "left" : "right";
        // TODO: Angles
        return new Flipper(a, side, delta.magnitude);
      }
    },

    // drain
    (node, m) => {
      if (node.matches("rect.drain")) {
        const left = getNumberProp(node.getAttribute("x"));
        const top = getNumberProp(node.getAttribute("y"));
        const width = getNumberProp(node.getAttribute("width"));
        const height = getNumberProp(node.getAttribute("height"));
        const angle = getAngle(m);
        const y = top + height / 2;
        // TODO: transform width & height
        const topLeft = transformPoint(left, top, m);
        return new Drain(Rect.fromTopLeft(topLeft, width, height));
      }
    },
  ];
  return extractors;
}
