#version 300 es

layout(location=0) in vec4 a_position;
layout(location=1) in mat4 a_transform;
layout(location=5) in vec4 a_color;

out vec4 v_color;

uniform mat4 u_projection;

void main( ) {
    gl_Position = u_projection * a_transform * a_position;
    v_color = a_color;
}