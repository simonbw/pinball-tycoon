varying vec2 vTextureCoord;


void main() {
  vec4 middleColor = vec4(0.8, 0.8, 0.8, 0.8);
  vec4 edgeColor = vec4(0.0, 0.0, 0.0, 1.0);

  vec2 d = (vTextureCoord - vec2(0.5, 0.5)) * 2.0;
  float r = sqrt(dot(d, d));
  float mixAmount = pow(clamp(1.0 - r, 0.0, 1.0), 0.5);
  float a;
  if (r > 1.0) {
    a = 0.0;
  } else if (r > 0.5) {
    a = 1.0 - (r - 0.5) * 2.0;
  } else {
    a = 1.0;
  }
  gl_FragColor = mix(edgeColor, middleColor, mixAmount) * a;
}