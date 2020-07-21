declare module "svg-path-parse" {
  export function pathParse(d: string): ParseResult;

  type AbsoluteSegmentType =
    | "M"
    | "L"
    | "H"
    | "V"
    | "C"
    | "S"
    | "Q"
    | "T"
    | "A"
    | "Z";
  type RelativeSegmentType =
    | "m"
    | "l"
    | "h"
    | "v"
    | "c"
    | "s"
    | "q"
    | "t"
    | "a"
    | "z";
  type SegmentType = AbsoluteSegmentType | RelativeSegmentType;

  interface NormalizedSegment<T> {
    type: T;
    args: number[];
  }

  interface Result<T> {
    err?: string;
    segments: T;
  }

  interface ParseResult {
    getSegments: () => Result<[SegmentType, ...number[]]>;
    normalize: () => Result<NormalizedSegment<SegmentType>[]>;
    absNormalize: () => Result<NormalizedSegment<AbsoluteSegmentType>[]>;
    relNormalize: () => Result<NormalizedSegment<RelativeSegmentType | "M">[]>;
    serializePath: () => string;
  }
}
