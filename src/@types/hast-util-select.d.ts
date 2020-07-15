declare module "hast-util-select" {
  import type { HastSvgElementNode, HastSvgNode } from "svg-parser";

  function matches(selector: string, node: HastSvgNode): boolean;

  function select(
    selector: string,
    tree: HastSvgNode
  ): HastSvgElementNode | undefined;

  function selectAll(selector: string, tree: HastSvgNode): HastSvgElementNode[];
}
