#version 300 es

precision mediump float;

layout(location=0) out vec4 out_color;
layout(location=1) out vec4 out_position;
layout(location=2) out vec4 out_normal;

in vec2 v_uv;
in vec3 v_normal;
in vec4 v_position;

uniform sampler2D u_texture_albedo;

layout(std140) uniform Material {
  uniform vec3 ambient;
  uniform vec3 diffuse;
  uniform vec3 specular;
  uniform vec3 opacity; // r channel is opacity
  uniform vec4 textures; // 0 -> albedo 1 -> normal 2 -> specular
} material;

void main() {
  vec3 albedo_texture = texture(u_texture_albedo, v_uv).rgb;
  vec3 albedo = (albedo_texture * material.textures.x) + (material.diffuse * (1.0 - material.textures.x));

  out_color = vec4(albedo, 1.0);
  out_position = v_position;
  out_normal = vec4(v_normal, 1.0);
}