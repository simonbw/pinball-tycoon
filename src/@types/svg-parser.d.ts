// Type definitions for svg-parser 2.0
// Project: https://github.com/Rich-Harris/svg-parser
// Definitions by: mrmlnc <https://github.com/mrmlnc>
//                 Joel Shinness <https://github.com/JoelCodes>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.1

declare module "svg-parser" {
  export interface HastSvgTextNode {
    type: "text";
    value?: string | boolean | number;
  }

  export interface HastSvgElementNode {
    type: "element";
    tagName?: string;
    properties?: Record<string, string>;
    children: Array<HastSvgChildNode | string>;
    value?: string;
    metadata?: string;
  }

  export type HastSvgChildNode = HastSvgTextNode | HastSvgElementNode;

  export interface HastSvgRootNode {
    type: "root";
    children: [HastSvgChildNode];
  }

  export type HastSvgNode = HastSvgRootNode | HastSvgChildNode;

  export function parse(source: string): HastSvgRootNode;
}
