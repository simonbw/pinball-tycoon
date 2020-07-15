declare module "js-svg-path" {
  class Shape {}
  class Outline {
    getShapes(): Shape[];
    getShape(index: number): Shape;
  }
  function parse(a: string): Outline;
}
