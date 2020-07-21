import { Matrix3 } from "three";
import Entity from "../../../core/entity/Entity";
import { getExtractors } from "./getExtrators";

export function getChildrenFromDoc(doc: Document) {
  return getChildrenFromNode(doc.getRootNode());
}

function getChildrenFromNode(
  node: Node,
  transform: Matrix3 = new Matrix3(),
  entities: Entity[] = []
) {
  if (isTextNode(node)) {
    return entities;
  }

  if (isSVGElement(node)) {
    if (node.matches(".ignore")) {
      return entities;
    }

    const localTransform = node.getAttribute("transform");
    if (localTransform) {
      transform = transform.clone().multiply(parseTransform(localTransform));
    }

    for (const extractor of getExtractors()) {
      const entity = extractor(node, transform);
      if (entity != undefined) {
        entities.push(entity);
      }
    }
  }

  node.childNodes.forEach((child) =>
    getChildrenFromNode(child, transform, entities)
  );

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

function isTextNode(node: Node): node is Text {
  return node.nodeType === Node.TEXT_NODE;
}

function isElement(node: Node): node is Element {
  return node.nodeType === Node.ELEMENT_NODE;
}

function isSVGElement(node: Node): node is SVGElement {
  return isElement(node);
}
