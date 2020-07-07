varying vec2 vTextureCoord;

// uniform vec3 vLightPosition[8];
// uniform vec3 vLightColor[8];
// uniform float fLightConstPower[8];
// uniform float fLightLinearPower[8];
// uniform float fLightQuadraticPower[8];

// struct PointLight {
//   vec3 direction;
//   vec3 color;
//   float constPower;
//   float linearPower;
//   float quadraticPower;
// };

// struct Material {
//   vec3 ambientColor;
//   vec3 diffuseColor;
//   vec3 specularColor;
//   float shininess;
// };

// vec3 applyPointLight(vec3 n, PointLight light, Material material) {
//   vec3 l = normalize(light.direction);
//   vec3 E = vec3(0.0, 0.0, 1.0);
//   vec3 R = reflect(-l, n);
  
//   float cosTheta = clamp(dot(l, n), 0.0, 1.0);
//   float cosAlpha = clamp(dot(E, R), 0.0, 1.0);
  
//   float d = length(light.direction);
//   float d2 = d * d;

//   float divisor = 1.0; //d2 / light.quadraticPower + d / light.linearPower + light.constPower;
  
//   vec3 diffuse = material.diffuseColor * light.color * cosTheta / divisor;
//   vec3 specular = material.specularColor * light.color * pow(cosAlpha, material.shininess) / divisor;
  
//   return diffuse + specular;
// }

void main() {
  // vec2 uv = (vTextureCoord - vec2(0.5, 0.5)) * 2.0;
  // float h = sqrt(1.0 - length(uv)); // TODO: This is almost right
  // vec3 pos = vec3(uv, h);
  // vec3 n = normalize(pos);

  // Material material = Material(
  //   vec3(0.25, 0.25, 0.25),
  //   vec3(0.5, 0.5, 0.5),
  //   vec3(1.0, 1.0, 1.0),
  //   7.0
  // );

  // gl_FragColor.xyz = material.ambientColor;
  // gl_FragColor.a = 1.0;

  // for (int i = 0; i < 8; i++) {
  //   PointLight light = PointLight(
  //     vLightPosition[i],
  //     vLightColor[i],
  //     fLightConstPower[i],
  //     fLightLinearPower[i],
  //     fLightQuadraticPower[i]
  //   );
  //   gl_FragColor.xyz += applyPointLight(n, light, material);
  // }

  // PointLight light = PointLight(
  //   vec3(-3.0, -3.0, 10.0),
  //   vec3(1.0, 1.0, 1.0),
  //   1.0,
  //   0.0,
  //   0.0
  // );
  // gl_FragColor.xyz += applyPointLight(n, light, material);
   
  // float r = length(uv);
  // float a = clamp(6.0 - 6.0 * r, 0.0, 1.0); // fuzz the edges a bit
  
  // gl_FragColor *= a;

  gl_FragColor = vec4(vTextureCoord.xy, 0.0, 1.0);
}

