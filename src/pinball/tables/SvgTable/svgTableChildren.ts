import { matches } from "hast-util-select";
import { HastSvgElementNode, HastSvgNode } from "svg-parser";
import { Matrix3, Matrix } from "three";
import Entity from "../../../core/entity/Entity";
import { getExtractors } from "./getExtrators";

export function getChildrenFromHast(
  node: HastSvgNode,
  transform: Matrix3 = new Matrix3(),
  entities: Entity[] = []
): Entity[] {
  if (node.type === "text" || matches(".ignore", node)) {
    return entities;
  }

  if (node.type === "element") {
    if (node.properties?.transform) {
      const localMatrix = parseTransform(node.properties.transform);
      transform = transform.clone().multiply(localMatrix);
    }

    for (const extractor of getExtractors()) {
      const entity = extractor(node, transform);
      if (entity != undefined) {
        entities.push(entity);
      }
    }
  }

  for (const child of node.children) {
    if (typeof child === "object") {
      getChildrenFromHast(child, transform, entities);
    }
  }

  return entities;
}

function parseTransform(s: string): Matrix3 {
  const matrix = new Matrix3();
  const [a, b, c, d, tx, ty] = s
    .substring("matrix(".length, s.length - 1)
    .split(", ")
    .map((v) => parseFloat(v));
  matrix.set(a, c, tx, b, d, ty, 0, 0, 1);
  return matrix;
}
