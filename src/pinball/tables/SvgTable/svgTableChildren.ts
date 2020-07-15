import { matches } from "hast-util-select";
import { HastSvgElementNode, HastSvgNode } from "svg-parser";
import { Matrix3 } from "three";
import Entity from "../../../core/entity/Entity";
import { V } from "../../../core/Vector";
import OverheadLight from "../../graphics/OverheadLight";
import Bumper from "../../playfield/Bumper";
import MultiWall from "../../playfield/MultiWall";
import { getNumberProp, parsePointString, parseStyle } from "./svgUtils";
import Plunger from "../../playfield/Plunger";

export function getChildrenFromHast(
  node: HastSvgNode,
  transform: Matrix3 = new Matrix3(),
  entities: Entity[] = []
): Entity[] {
  if (node.type === "text" || matches(".ignore", node)) {
    return entities;
  }

  if (node.type === "element") {
    for (const extractor of extractors) {
      const entity = extractor(node, transform);
      if (entity != undefined) {
        entities.push(entity);
      }
    }
  }

  const childTransform = transform;

  for (const child of node.children) {
    if (typeof child === "object") {
      getChildrenFromHast(child, childTransform, entities);
    }
  }

  return entities;
}

type Extractor = (
  node: HastSvgElementNode,
  transform: Matrix3
) => Entity | undefined | void;

const f: Extractor = (n, t) => {
  return undefined;
};

const extractors: Extractor[] = [
  // Wall
  (node, transform) => {
    if (matches("polyline", node)) {
      const pointsStr = node.properties!.points! as string;
      const points = parsePointString(pointsStr);
      if (points.length < 2) {
        console.warn("single point polyline:", node);
        return;
      }
      const width = parseStyle(node.properties?.style).strokeWidth;
      // TODO: Wall width
      return new MultiWall(points);
    }
  },

  // Bumper
  (node, transform) => {
    if (matches("circle.bumper", node)) {
      const x = getNumberProp(node?.properties?.cx);
      const y = getNumberProp(node?.properties?.cy);
      const r = getNumberProp(node?.properties?.r, undefined);
      return new Bumper(V(x, y), r);
    }
  },

  // Lights
  (node, transform) => {
    if (matches("circle.light", node)) {
      const x = getNumberProp(node?.properties?.cx);
      const y = getNumberProp(node?.properties?.cy);
      return new OverheadLight(V(x, y));
    }
  },

  // plunger
  (node, transform) => {
    if (matches("circle.plunger", node)) {
      const x = getNumberProp(node?.properties?.cx);
      const y = getNumberProp(node?.properties?.cy);
      const r = getNumberProp(node?.properties?.r);
      return new Plunger(V(x, y), r * 2);
    }
  },
];
