import { matches } from "hast-util-select";
import { HastSvgElementNode } from "svg-parser";
import { Matrix3 } from "three";
import Entity from "../../../core/entity/Entity";
import OverheadLight from "../../graphics/OverheadLight";
import Bumper from "../../playfield/Bumper";
import MultiWall from "../../playfield/MultiWall";
import Plunger from "../../playfield/Plunger";
import {
  getNumberProp,
  parsePointString,
  parseStyle,
  transformPoint,
  getAngle,
} from "./svgUtils";
import Goal from "../../playfield/Goal";
import Defender from "../../playfield/Defender";
import Goalie from "../../playfield/Goalie";

export type Extractor = (
  node: HastSvgElementNode,
  transform: Matrix3
) => Entity | undefined | void;

export function getExtractors() {
  const extractors: Extractor[] = [
    // Multiwall
    (node, m) => {
      if (matches("polyline", node)) {
        const pointsStr = node.properties!.points! as string;
        const points = parsePointString(pointsStr).map(([x, y]) =>
          transformPoint(x, y, m)
        );
        if (points.length < 2) {
          console.warn("single point polyline:", node);
          return;
        }
        const width = parseStyle(node.properties?.style).strokeWidth;
        // TODO: Wall width
        return new MultiWall(points);
      }
    },

    // Curve walls
    // Bumper
    (node, m) => {
      if (matches("circle.bumper", node)) {
        const x = getNumberProp(node?.properties?.cx);
        const y = getNumberProp(node?.properties?.cy);
        const r = getNumberProp(node?.properties?.r, undefined);

        return new Bumper(transformPoint(x, y, m), r);
      }
    },

    // Lights
    (node, m) => {
      if (matches("circle.light", node)) {
        const x = getNumberProp(node?.properties?.cx);
        const y = getNumberProp(node?.properties?.cy);

        return new OverheadLight(transformPoint(x, y, m));
      }
    },

    // plunger
    (node, m) => {
      if (matches("circle.plunger", node)) {
        const x = getNumberProp(node?.properties?.cx);
        const y = getNumberProp(node?.properties?.cy);
        const r = getNumberProp(node?.properties?.r);
        return new Plunger(transformPoint(x, y, m), r * 2);
      }
    },

    // goal
    (node, m) => {
      if (matches("rect.goal", node)) {
        const left = getNumberProp(node?.properties?.x);
        const top = getNumberProp(node?.properties?.y);
        const width = getNumberProp(node?.properties?.width);
        const height = getNumberProp(node?.properties?.height);
        const angle = getAngle(m);
        const x = left + width / 2;
        const y = top + height / 2;
        // TODO: transform width & height
        return new Goal(transformPoint(x, y, m), angle, width, height);
      }
    },

    // defender
    (node, m) => {
      if (matches("line.defender", node)) {
        const x1 = getNumberProp(node?.properties?.x1);
        const y1 = getNumberProp(node?.properties?.y1);
        const x2 = getNumberProp(node?.properties?.x2);
        const y2 = getNumberProp(node?.properties?.y2);
        const a = transformPoint(x1, y1, m);
        const b = transformPoint(x2, y2, m);
        const center = a.add(b).imul(0.5);
        const delta = b.sub(a);
        return new Defender(center, delta.angle);
      }
    },

    // goalie
    (node, m) => {
      if (matches("line.goalie", node)) {
        const x1 = getNumberProp(node?.properties?.x1);
        const y1 = getNumberProp(node?.properties?.y1);
        const x2 = getNumberProp(node?.properties?.x2);
        const y2 = getNumberProp(node?.properties?.y2);
        const a = transformPoint(x1, y1, m);
        const b = transformPoint(x2, y2, m);
        const center = a.add(b).imul(0.5);
        const delta = b.sub(a);
        return new Goalie(a, b);
      }
    },
  ];
  return extractors;
}
