type Path = [number, number][];

declare module "poly-decomp" {
  function quickDecomp(points: Path): Path[];
  function decomp(points: Path): Path[];
  function isSimple(points: Path): boolean;
  function makeCCW(points: Path): void;
  function removeCollinearPoints(points: Path, thresholdAngle: number): void;
  function removeDuplicatePoints(points: Path, precision: number): void;
}
