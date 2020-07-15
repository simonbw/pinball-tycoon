import { V, V2d } from "../../../core/Vector";
import { HastSvgRootNode, HastSvgNode, HastSvgChildNode } from "svg-parser";

export async function fetchText(url: string): Promise<string> {
  const response = await fetch(url);
  return await response.text();
}

/** Makes sure the tree is in good order */
export function cleanupTree(root: HastSvgRootNode) {
  const stack: HastSvgNode[] = [root];
  while (stack.length > 0) {
    const current = stack.pop()!;

    if (current.type == "text") {
      continue;
    }

    for (const child of current?.children ?? []) {
      if (typeof child != "string") {
        stack.push(child);
      }
    }

    // DO STUFF
    cleanNode(current);
  }

  return root;
}

function cleanNode(node: HastSvgNode) {
  if (node.type === "element") {
    if (node.properties?.["class"]) {
      node.properties["className"] = node.properties["class"];
    }
  }
}

export function getNumberProp<T = 0>(
  value?: string | number,
  backup?: T
): number | T {
  if (typeof value === "number") {
    return value;
  } else if (typeof value === "string") {
    return parseFloat(value);
  } else {
    return backup ?? 0;
  }
}

// TODO: This isn't quite right
export function parseStyle(s: string = ""): CSSStyleDeclaration {
  const result: { [name: string]: any } = {};

  for (const line of s.split(";")) {
    const [name, value] = line.split(":");
    result[name] = value;
  }

  return result as CSSStyleDeclaration;
}

export function parsePointString(s: string): V2d[] {
  const values = s.split(/\s/).map((s) => parseFloat(s));
  const points = [];
  for (let i = 0; i < values.length - 1; i += 2) {
    const x = values[i];
    const y = values[i + 1];
    points.push(V(x, y));
  }
  return points;
}
