uniform float opacity;
uniform sampler2D tDiffuse;
varying vec2 vUv;

uniform float focusAmount;

void main() {
  vec4 texel = texture2D(tDiffuse, vUv);
  vec4 base = opacity * texel;

  float threshold = 0.9;
  float m = max(base.r, max(base.g, base.b));
  if (m > threshold) {
    float t = (m - threshold) / (1.0 - threshold);
    gl_FragColor = base + vec4(1.0, 1.0, 1.0, 0.0) * t;
  } else {
    gl_FragColor = base;
  }
}  