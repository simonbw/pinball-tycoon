varying vec2 vTextureCoord;

uniform sampler2D uSampler;

#define NUM_LIGHTS 32

uniform vec3 vLightPosition[NUM_LIGHTS];
uniform vec3 vLightColor[NUM_LIGHTS];
uniform float fLightPower[NUM_LIGHTS];
uniform float fLightLinearFade[NUM_LIGHTS];
uniform float fLightQuadraticFade[NUM_LIGHTS];
uniform float fLightRadius[NUM_LIGHTS];

uniform vec3 vAmbientLightColor;
uniform vec3 vMaterialDiffuseColor;
uniform vec3 vMaterialSpecularColor;
uniform float fMaterialShininess;

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
  
  // TODO: Blinn-phong

  return diffuse + specular;
}

void main() {
  vec2 uv = (vTextureCoord - vec2(0.5, 0.5)) * 2.0;
  float h = sqrt(1.0 - uv.x * uv.x - uv.y * uv.y);
  vec3 pos = vec3(uv, h);
  vec3 n = normalize(pos);

  Material material = Material(
    vAmbientLightColor,
    vMaterialDiffuseColor,
    vMaterialSpecularColor,
    fMaterialShininess
  );

  gl_FragColor.xyz = material.ambientColor;
  gl_FragColor.a = 1.0;

  for (int i = 0; i < NUM_LIGHTS; i++) {
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
  float a = clamp(16.0 - 16.0 * r, 0.0, 1.0); // fuzz the edges a bit
  
  gl_FragColor *= a;
}

