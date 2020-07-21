import { degToRad } from "../../../core/util/MathUtil";
import { V, V2d } from "../../../core/Vector";
import { Rect } from "../../util/Rect";

export function getBallDropPosition(doc: Document): V2d {
  const node = doc.getElementById("ball-drop")!;
  const x = parseFloat(node.getAttribute("cx") ?? "0");
  const y = parseFloat(node.getAttribute("cy") ?? "0");
  return V(x, y);
}

export function getIncline(doc: Document): number {
  return degToRad(4.5);
}

export function getTableBounds(doc: Document): Rect {
  const boundsNode = doc.querySelector("rect#bounds")!;
  const x = parseFloat(boundsNode.getAttribute("x") ?? "0");
  const y = parseFloat(boundsNode.getAttribute("y") ?? "0");
  const width = parseFloat(boundsNode.getAttribute("width") ?? "0");
  const height = parseFloat(boundsNode.getAttribute("height") ?? "0");
  return Rect.fromTopLeft([x, y], width, height);
}
