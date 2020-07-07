varying vec2 vTextureCoord;


void main() {
  vec4 middleColor = vec4(0.0, 0.0, 0.0, 0.5);

  vec2 d = (vTextureCoord - vec2(0.5, 0.5)) * 2.0;
  float r = sqrt(dot(d, d));
  float a;
  if (r > 1.0) {
    a = 0.0;
  } else if (r > 0.5) {
    a = 2.0 - 2.0 * r;
  } else {
    a = 1.0;
  }
  gl_FragColor = middleColor * a;
}