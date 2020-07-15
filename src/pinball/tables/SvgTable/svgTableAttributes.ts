import { select } from "hast-util-select";
import { HastSvgNode } from "svg-parser";
import { degToRad } from "../../../core/util/MathUtil";
import { V, V2d } from "../../../core/Vector";
import { Rect } from "../../util/Rect";

export function getBallDropPosition(tree: HastSvgNode): V2d {
  const circle = select("circle#ball-drop", tree);
  const x = parseFloat(circle?.properties?.cx ?? "0");
  const y = parseFloat(circle?.properties?.cy ?? "0");
  return V(x, y);
}

export function getIncline(svgElement: HastSvgNode): number {
  return degToRad(15);
}

export function getTableBounds(tree: HastSvgNode): Rect {
  const boundsNode = select("rect#bounds", tree)!;
  const x = parseFloat(boundsNode?.properties?.x ?? "0");
  const y = parseFloat(boundsNode?.properties?.y ?? "0");
  const width = parseFloat(boundsNode?.properties?.width ?? "0");
  const height = parseFloat(boundsNode?.properties?.height ?? "0");
  return { top: y, bottom: y + height, left: x, right: x + width };
}
