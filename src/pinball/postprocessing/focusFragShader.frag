uniform float opacity;
uniform sampler2D tDiffuse;
varying vec2 vUv;

uniform float focusAmount;

void main() {
  vec4 texel = texture2D(tDiffuse, vUv);
  gl_FragColor = opacity * texel;

  float r = length(vUv - vec2(0.5, 0.5));
  float p = pow(1.0 - focusAmount * (r - 0.2), 0.7);

  gl_FragColor *= p;
}  