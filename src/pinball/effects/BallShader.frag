varying vec2 vTextureCoord;

uniform vec3 vLightPosition[8];
uniform vec3 vLightColor[8];
uniform float fLightPower[8];
uniform float fLightLinearFade[8];
uniform float fLightQuadraticFade[8];
uniform float fLightRadius[8];

uniform vec3 fAmbientLightColor;
uniform vec3 fMaterialDiffuseColor;
uniform vec3 fMaterialSpecularColor;
uniform vec3 fMaterialShininess;

struct SphereLight {
  vec3 direction;
  vec3 color;
  float power;
  float linearFade;
  float quadraticFade;
  float radius;
};

struct Material {
  vec3 ambientColor;
  vec3 diffuseColor;
  vec3 specularColor;
  float shininess;
};

vec3 applyPointLight(vec3 n, SphereLight light, Material material) {
  vec3 l = normalize(light.direction);
  vec3 E = vec3(0.0, 0.0, 1.0);
  vec3 R = reflect(-l, n);
  
  float cosTheta = clamp(dot(l, n), 0.0, 1.0);
  float cosAlpha = clamp(dot(E, R), 0.0, 1.0);
  
  float d = max(length(light.direction) - light.radius, 0.0);
  float divisor = 1.0 + d * d * light.quadraticFade + d * light.linearFade;
  
  vec3 diffuse = material.diffuseColor * light.color * light.power * cosTheta / divisor;
  vec3 specular = material.specularColor * light.color * pow(cosAlpha, material.shininess) / divisor;
  
  return diffuse + specular;
}

void main() {
  vec2 uv = (vTextureCoord - vec2(0.5, 0.5)) * 2.0;
  float h = sqrt(1.0 - uv.x * uv.x - uv.y * uv.y);
  vec3 pos = vec3(uv, h);
  vec3 n = normalize(pos);

  Material material = Material(
    vec3(0.25, 0.25, 0.25),
    vec3(0.5, 0.5, 0.5),
    vec3(1.0, 1.0, 1.0) * 0.3,
    12.0
  );

  gl_FragColor.xyz = material.ambientColor;
  gl_FragColor.a = 1.0;

  for (int i = 0; i < 8; i++) {
    SphereLight light = SphereLight(
      vLightPosition[i],
      vLightColor[i],
      fLightPower[i],
      fLightLinearFade[i],
      fLightQuadraticFade[i],
      fLightRadius[i]
    );
    gl_FragColor.xyz += applyPointLight(n, light, material);
  }

  float r = length(uv);
  float a = clamp(6.0 - 6.0 * r, 0.0, 1.0); // fuzz the edges a bit
  
  gl_FragColor *= a;
}

