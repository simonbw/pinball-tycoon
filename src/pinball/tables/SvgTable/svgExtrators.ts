import { Color, Matrix3 } from "three";
import Entity from "../../../core/entity/Entity";
import { degToRad } from "../../../core/util/MathUtil";
import Popper from "../../playfield/Popper";
import Bumper from "../../playfield/Bumper";
import LightUpTarget from "../../playfield/LightUpTarget";
import Defender from "../../playfield/Defender";
import Drain from "../../playfield/Drain";
import Flipper from "../../playfield/Flipper";
import Gate from "../../playfield/Gate";
import Goal from "../../playfield/Goal";
import Goalie from "../../playfield/Goalie";
import BallRemainingLamp from "../../playfield/lamps/BallRemainingLamp";
import BallSaveLamp from "../../playfield/lamps/BallSaveLamp";
import { BULB_GEOMETRY_ARROW } from "../../playfield/lamps/LampShapes";
import SlowMoLamps from "../../playfield/lamps/SlowMoLamps";
import TargetLamp from "../../playfield/lamps/TargetLamp";
import Magnet from "../../playfield/Magnet";
import MagnetOrbiter from "../../playfield/MagnetOrbiter";
import OverheadLight from "../../environment/OverheadLight";
import Plunger from "../../playfield/Plunger";
import Post from "../../playfield/Post";
import Slingshot from "../../playfield/Slingshot";
import Spinner from "../../playfield/Spinner";
import MultiWall from "../../playfield/walls/MultiWall";
import PathWall from "../../playfield/walls/PathWall";
import { Rect } from "../../util/Rect";
import {
  getAngleAttribute,
  getNumberAttribute,
  getNumberProp,
  getTransformAngle,
  getTransformHeight,
  getTransformWidth,
  parsePointString,
  pathStringToShape,
  transformPoint,
} from "./svgUtils";
import Scoop from "../../playfield/Scoop";
import TargetBank from "../../system/TargetBank";
import Rollover from "../../playfield/Rollover";
import BlobWall from "../../playfield/walls/BlobWall";

export type Extractor = (
  node: SVGElement,
  transform: Matrix3,
  nodeToEntity: Map<Node, Entity>
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
      if (node.matches("path.wall")) {
        const pathString = node.getAttribute("d") ?? "";
        const shapePath = pathStringToShape(pathString);
        const width = getNumberProp(node.style.strokeWidth, 1.0);
        const height = getNumberAttribute(node, "data-height");

        if (node.style.fill != "none") {
          return new BlobWall(shapePath, m, { height });
        } else {
          return new PathWall(shapePath, width, m);
        }
      }
    },

    // Bumper
    (node, m) => {
      if (node.matches("circle.rollover")) {
        const x = getNumberProp(node.getAttribute("cx"));
        const y = getNumberProp(node.getAttribute("cy"));
        const r = getNumberProp(node.getAttribute("r"), undefined);
        const position = transformPoint(x, y, m);
        const direction = getAngleAttribute(node, "data-direction");
        const color = new Color(node.style.fill).getHex();
        const id = node.id;

        return new Rollover(position, r, { direction, color, id });
      }
    },

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
        const x = getNumberAttribute(node, "cx") ?? 0;
        const y = getNumberAttribute(node, "cy") ?? 0;
        const r = getNumberAttribute(node, "r");
        const height = getNumberAttribute(node, "height");

        return new Post(transformPoint(x, y, m), r, height);
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

    (node, m) => {
      if (node.matches("circle.air-kicker")) {
        const x = getNumberProp(node.getAttribute("cx"));
        const y = getNumberProp(node.getAttribute("cy"));
        const r = getNumberProp(node.getAttribute("r"));
        return new Popper(transformPoint(x, y, m), r);
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

    // ball-remaining lamps
    (node, m) => {
      if (node.matches("circle.ball-remaining-lamp")) {
        const x = getNumberProp(node.getAttribute("cx"));
        const y = getNumberProp(node.getAttribute("cy"));
        const minBalls = getNumberProp(node.getAttribute("data-min-balls"));
        return new BallRemainingLamp(transformPoint(x, y, m), minBalls);
      }
    },

    // ball-save lamps
    (node, m) => {
      if (node.matches("circle.ball-save-lamp")) {
        const x = getNumberProp(node.getAttribute("cx"));
        const y = getNumberProp(node.getAttribute("cy"));
        return new BallSaveLamp(transformPoint(x, y, m));
      }
    },

    // slow-mo lamps
    (node, m) => {
      if (node.matches("rect.slow-mo-lamps")) {
        const left = getNumberProp(node.getAttribute("x"));
        const top = getNumberProp(node.getAttribute("y"));
        const width = getNumberProp(node.getAttribute("width"));
        const height = getNumberProp(node.getAttribute("height"));
        const x = left + width / 2;
        const y = top + height / 2;
        return new SlowMoLamps(transformPoint(x, y, m));
      }
    },

    // target lamps
    (node, m) => {
      if (
        node.matches(`use`) &&
        node.getAttribute("xlink:href") === "#target-lamp-symbol"
      ) {
        const [w, h] = [getTransformWidth(m), getTransformHeight(m)];
        const width = getNumberProp(node.getAttribute("width")) * w;
        const height = getNumberProp(node.getAttribute("height")) * h;
        const angle = getTransformAngle(m);
        const position = transformPoint(width / 2, height / 2, m);
        const bulbGeometry = BULB_GEOMETRY_ARROW;
        const size = (width + height) / 4;
        const color = new Color(node.style.fill).getHex();

        return new TargetLamp(position, node.id, {
          bulbGeometry,
          angle,
          size,
          color,
          intensity: 0.7,
        });
      }
    },

    // target lamps
    (node, m) => {
      if (node.matches(`.target-bank`)) {
        return new TargetBank();
      }
    },

    // target lamps
    (node, m, nodeToEntity) => {
      if (node.matches(`.target-bank > line`)) {
        const x1 = getNumberProp(node.getAttribute("x1"));
        const y1 = getNumberProp(node.getAttribute("y1"));
        const x2 = getNumberProp(node.getAttribute("x2"));
        const y2 = getNumberProp(node.getAttribute("y2"));
        const a = transformPoint(x1, y1, m);
        const b = transformPoint(x2, y2, m);
        const center = a.add(b).imul(0.5);
        const delta = b.sub(a);
        const color = new Color(node.style.stroke).getHex();
        const target = new LightUpTarget(
          center,
          delta.angle,
          delta.magnitude,
          color
        );

        const maybeBank = nodeToEntity.get(node.parentElement!);
        if (maybeBank instanceof TargetBank) {
          maybeBank.addTarget(target);
        } else {
          return target;
        }
      }
    },

    // scoop
    (node, m) => {
      if (node.matches("rect.scoop")) {
        const [w, h] = [getTransformWidth(m), getTransformHeight(m)];
        const left = getNumberProp(node.getAttribute("x"));
        const top = getNumberProp(node.getAttribute("y"));
        const width = getNumberAttribute(node, "width") ?? 0;
        const height = getNumberAttribute(node, "height") ?? 0;
        const angle = getTransformAngle(m);
        const x = left + width / 2;
        const y = top + height / 2;
        // TODO: transform width & height
        return new Scoop(transformPoint(x, y, m), angle, width * w, height * h);
      }
    },

    // goal
    (node, m) => {
      if (node.matches("rect.goal")) {
        const [w, h] = [getTransformWidth(m), getTransformHeight(m)];
        const left = getNumberProp(node.getAttribute("x"));
        const top = getNumberProp(node.getAttribute("y"));
        const width = getNumberAttribute(node, "width") ?? 0;
        const height = getNumberAttribute(node, "height") ?? 0;
        const angle = getTransformAngle(m);
        const x = left + width / 2;
        const y = top + height / 2;
        // TODO: transform width & height
        return new Goal(transformPoint(x, y, m), angle, width * w, height * h);
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
        const middleOffset = getNumberAttribute(node, "data-middle-offset");
        const angleSpread = getAngleAttribute(node, "data-angle-spread");
        const minStrength = getNumberAttribute(node, "data-min-strength");
        const maxStrength = getNumberAttribute(node, "data-max-strength");
        const color = new Color(node.style.stroke).getHex();
        return new Slingshot(a, b, {
          middleOffset,
          angleSpread,
          minStrength,
          maxStrength,
          color,
        });
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
        const width = getNumberProp(node.style.strokeWidth, undefined);
        const swing = getAngleAttribute(node, "data-swing");
        const strength = getNumberAttribute(node, "data-strength");
        const length = delta.magnitude;
        const angle = delta.angle;
        return new Flipper(a, side, length, width, angle, swing, strength);
      }
    },

    // drain
    (node, m) => {
      if (node.matches("rect.drain")) {
        const left = getNumberProp(node.getAttribute("x"));
        const top = getNumberProp(node.getAttribute("y"));
        const width = getNumberProp(node.getAttribute("width"));
        const height = getNumberProp(node.getAttribute("height"));
        const y = top + height / 2;
        // TODO: transform width & height
        const topLeft = transformPoint(left, top, m);
        return new Drain(Rect.fromTopLeft(topLeft, width, height));
      }
    },
  ];
  return extractors;
}
