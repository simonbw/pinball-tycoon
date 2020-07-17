uniform float opacity;
uniform sampler2D tDiffuse;
varying vec2 vUv;

uniform float focusAmount;

void main() {
  vec4 texel = texture2D(tDiffuse, vUv);
  gl_FragColor = opacity * texel;

  float r = 1.0 - focusAmount * (length(vUv - vec2(0.5, 0.5)) - 0.1);

  gl_FragColor *= pow(r, 0.7);
}  