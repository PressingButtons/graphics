import { mat4 } from "gl-matrix";
import BufferObject from "../../etc/buffer_object";
import TransformBuffer from "../../etc/transform.buffer";
import createVAO from "../../etc/vao_object";

export default async function ColorShader( gl:WebGL2RenderingContext ) {
    // compile 
    const vert = await fetch(new URL('./vertex.glsl', import.meta.url)).then(res => res.text( )); 
    const vShader = gl.createShader(gl.VERTEX_SHADER) as WebGLShader;
    gl.shaderSource(vShader, vert);
    gl.compileShader(vShader);

    const frag = await fetch(new URL('./fragment.glsl', import.meta.url)).then(res => res.text( ));
    const fShader = gl.createShader(gl.FRAGMENT_SHADER) as WebGLShader;
    gl.shaderSource(fShader, frag);
    gl.compileShader(fShader);

    const program = gl.createProgram( ) as WebGLProgram;
    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);

    // create buffers 
    const model = BufferObject(gl);
    model.setData(
        new Int8Array([-1, -1, 0,  0, 0, 1, -1, 0,  1, 0, -1, -1, 0,  0, 1, 1,  1, 0,  1, 1]),
        gl.STATIC_DRAW
    );

    const transform = TransformBuffer(gl);

    // prepare attributes
    const vao = createVAO(gl, program);
    vao.setAttribute(model.buffer, 'a_position', 3, gl.BYTE, 5, 0);
    vao.setAttributeMatrix(model.buffer, 'a_transform', 84, 0);
    vao.setiAttributeMulti(transform.buffer, 'a_color', 4, gl.FLOAT, 84, 64);

    // prepare uniforms 
    const u_projection = gl.getUniformLocation(program, 'u_projection') as WebGLUniformLocation;

    return ( projection:mat4, models:Model[] ) => {
        gl.useProgram( program );
        transform.set(models);
        gl.bindVertexArray( vao.object );
        gl.uniformMatrix4fv( u_projection, false, projection );
        gl.drawArraysInstanced( gl.TRIANGLE_STRIP, 0, 4, models.length );
    }

}