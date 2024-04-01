#version 300 es

layout(location=0) in vec4 a_position;
layout(location=1) in vec2 a_uv;

layout(std140) uniform Model {
  mat4 matrix;
  mat4 inv_trans_matrix;
  vec4 id; // red = id
} model;

out vec2 v_uv;

void main() {
  gl_Position = model.matrix * a_position;
  v_uv = a_uv;
}