import { Matrix3 } from "three";
import Entity from "../../../core/entity/Entity";
import { getExtractors } from "./svgExtrators";

export function getChildrenFromDoc(doc: Document): Entity[] {
  return [...getChildrenFromNode(doc.getRootNode()).values()];
}

function getChildrenFromNode(
  node: Node,
  transform: Matrix3 = new Matrix3(),
  entityMap: Map<SVGElement, Entity> = new Map()
) {
  if (isTextNode(node)) {
    return entityMap;
  }

  if (isSVGElement(node)) {
    if (node.matches(".ignore")) {
      return entityMap;
    }

    const localTransform = node.getAttribute("transform");
    if (localTransform) {
      transform = transform.clone().multiply(parseTransform(localTransform));
    }

    for (const extractor of getExtractors()) {
      const entity = extractor(node, transform, entityMap);
      if (entity != undefined) {
        entityMap.set(node, entity);
        if (node.id) {
          entity.id = node.id;
        }
        break; // TODO: Allow multiple entities per element?
      }
    }
  }

  node.childNodes.forEach((child) =>
    getChildrenFromNode(child, transform, entityMap)
  );

  return entityMap;
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
