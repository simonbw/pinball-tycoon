import { CurvePath, Vector3, LineCurve3 } from "three";

export default class Path3 extends CurvePath<Vector3> {
  private currentPoint: Vector3 = new Vector3(0, 0, 0);

  moveTo(x: number, y: number, z: number) {
    this.currentPoint.set(x, y, z);
    return this;
  }
  moveToV(v: Vector3) {
    return this.moveTo(v.x, v.y, v.z);
  }

  lineTo(x: number, y: number, z: number) {
    return this.lineToV(new Vector3(x, y, z));
  }
  lineToV(v: Vector3) {
    this.add(new LineCurve3(this.currentPoint.clone(), v.clone()));
    this.currentPoint.copy(v);
    return this;
  }
}
