export const vertex = `#version 300 es
    
layout(location=0) in vec4 a_position;
layout(location=1) in mat4 a_model;
layout(location=5) in vec4 a_color;

out vec4 v_color;

uniform mat4 u_projection;
uniform mat4 u_view;

void main( ) {
    gl_Position = u_projection * u_view * a_model * a_position;
    v_color = a_color;
}
`
export const fragment = `#version 300 es 

precision mediump float;

in  vec4 v_color;
out vec4 fragColor;

void main( ) {
    fragColor = v_color;
}
`