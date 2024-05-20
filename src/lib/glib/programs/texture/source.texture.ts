export const vertex = `#version 300 es
    
layout(location=0) in vec4 a_position;
layout(location=1) in vec2 a_texcoord;
layout(location=2) in mat4 a_model;
layout(location=6) in vec4 a_color;
layout(location=7) in float a_depth;

out vec4  v_color;
out vec2  v_texcoord;
out float v_depth;

uniform mat4 u_projection;
uniform mat4 u_view;

void main( ) {
    v_color = a_color;
    v_depth = a_depth;
    v_texcoord = a_texcoord;
    gl_Position = u_projection * u_view * a_model * a_position;
}
`
export const fragment = `#version 300 es 

precision mediump float;

uniform mediump sampler2DArray u_texture;

in vec4  v_color;
in vec2  v_texcoord;
in float v_depth; 

out vec4 fragColor;

void main( ) {
    fragColor = texture(u_texture, vec3(v_texcoord, v_depth)) * v_color;
}
`