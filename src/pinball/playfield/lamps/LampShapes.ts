import {
  CircleBufferGeometry,
  BufferGeometry,
  ShapeBufferGeometry,
  Shape,
} from "three";

export const BULB_GEOMETRY_CIRCLE = new CircleBufferGeometry(1, 32);
BULB_GEOMETRY_CIRCLE.rotateY(Math.PI);

const triangle = new Shape();
triangle.moveTo(0, -Math.sqrt(2));
triangle.lineTo(1, 0);
triangle.lineTo(-1, 0);
triangle.closePath();

export const BULB_GEOMETRY_TRIANGLE = new ShapeBufferGeometry(triangle);
BULB_GEOMETRY_TRIANGLE.translate(0, 0.5, 0);
BULB_GEOMETRY_TRIANGLE.rotateY(Math.PI);

const arrow = new Shape();
arrow.moveTo(0, -Math.sqrt(2));
arrow.lineTo(0.7, 0);
arrow.lineTo(0, -0.2);
arrow.lineTo(-0.7, 0);
arrow.closePath();

export const BULB_GEOMETRY_ARROW = new ShapeBufferGeometry(arrow);
BULB_GEOMETRY_ARROW.translate(0, 0.5, 0);
BULB_GEOMETRY_ARROW.rotateY(Math.PI);
