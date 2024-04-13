#version 300 es

precision mediump float;

layout(location=3) out vec4 outColor;

in vec2 v_uv;
uniform sampler2D u_texture_color;
uniform sampler2D u_texture_position;
uniform sampler2D u_texture_normal;

struct Spotlight {
    vec4 position;
    vec4 direction;
    vec4 angles; // x = inner, y = outer, z = is_active
};

struct Pointlight {
    vec4 position; // [x,y,z] -> position, w -> is_active
};

layout(std140) uniform Lighting {
    Spotlight spotlights[10];
    Pointlight pointlights[10];
};

const vec3 lightColor = vec3(1.0, 1.0, 1.0);

float point_light(vec3 l_position, vec3 o_position, vec3 normal) {
    vec3 offset = l_position - o_position;
    vec3 direction = normalize(offset);
    float distance = length(offset);

    float diffuse = max(0.0, dot(direction, normal));
    float attenuation = 4.0 / distance;
    return (diffuse * attenuation);
}

float spot_light(vec3 l_position, vec3 o_position, vec3 normal, vec3 direction, float inner, float outer) {
    vec3 offset = l_position - o_position;
    vec3 surfToLight = normalize(offset);

    float diffuse = max(0.0, dot(surfToLight, normalize(normal)));
    float angleToSurf = dot(direction, -surfToLight);
    float spot = smoothstep(inner, outer, angleToSurf);
    float attenuation = 1.0 / length(offset);
    return diffuse * spot * attenuation;
}

void main() {
  vec4 albedo = texture(u_texture_color, v_uv);
  vec3 position = texture(u_texture_position, v_uv).rgb;
  vec3 normal = normalize(texture(u_texture_normal, v_uv).rgb);

  float brightness = 0.0;
  float ambient = 0.05;

  for (int i = 0; i < 10; i++) {
    brightness += spot_light(
      spotlights[i].position.xyz,
      position,
      normal,
      spotlights[i].direction.xyz,
      spotlights[i].angles.x,
      spotlights[i].angles.y) * spotlights[i].angles.z;
    brightness += point_light(pointlights[i].position.xyz, position, normal) * pointlights[i].position.w;
  }

  outColor = albedo * brightness + ambient;
  outColor.a = albedo.a;
}