varying vec2 vTextureCoord;
uniform vec3 vLightDirection;

float getAlpha(float r) {
  if (r > 1.0) {
    return 0.0;
  } else if (r > 1.0 - 1.0 / 6.0) {
    return 6.0 - 6.0 * r;
  } else {
    return 1.0;
  }
}

vec4 ambientColor = vec4(0.25, 0.25, 0.25, 1.0);
vec4 diffuseColor = vec4(0.70, 0.70, 0.70, 1.0);
vec4 specularColor = vec4(1.0, 1.0, 1.0, 1.0);
vec4 lightColor = vec4(1.0, 1.0, 1.0, 1.0);
float lightPower = 1.0;
float phong = 6.0;

void main() {
  vec2 uv = (vTextureCoord - vec2(0.5, 0.5)) * 2.0;
  float h = sqrt(1.0 - length(uv));
  vec3 n = normalize(vec3(uv.x, uv.y, h));
  vec3 l = normalize(vLightDirection);
  float d = length(vLightDirection);
  float d2 = sqrt(d);
  vec3 E = vec3(0.0, 0.0, 1.0);
  vec3 R = reflect(-l,n);
  

  float cosTheta = clamp(dot(l, n), 0.0, 1.0);
  float cosAlpha = clamp(dot(E, R), 0.0, 1.0);
  
  vec4 ambient = ambientColor * lightColor;
  vec4 diffuse = diffuseColor * lightColor * lightPower * cosTheta / clamp(d2, 0.5, 1.0);
  vec4 specular = clamp(specularColor * lightColor * lightPower * pow(cosAlpha, phong) / d2, 0.0, 1.0) * 1.5;
  
  gl_FragColor = ambient + diffuse + specular;
  gl_FragColor *= getAlpha(length(uv));
}

