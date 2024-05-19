import type { mat4 } from "gl-matrix";
import Graphics from "../../graphics";
import VAOGener from "../../vaogener";
import ShaderProgram from "../shaderprogram";
import { fragment, vertex } from "./source.texture";

export default function generateTextureShader( gl: WebGL2RenderingContext, model: WebGLBuffer, transform: WebGLBuffer ) {

    const shader = new ShaderProgram(gl, vertex, fragment );

    shader.findAttributes(gl, ['a_position', 'a_texcoord', 'a_color', 'a_model', 'a_depth']);
    shader.findUniforms(gl,   ['u_projection', 'u_view', 'u_texture']);

    const vao = new VAOGener( );

    vao.setAttribute(model, shader.attributes[0], gl.BYTE, 3, 5, 0); // position 
    vao.setAttribute(model, shader.attributes[1], gl.BYTE, 2, 5, 3); // texcoord
    // multi attributes 
    vao.setAttributeMulti(transform, shader.attributes[2], gl.FLOAT, 4, Graphics.TRANSFORM_LENGTH, 64, 1); // color 
    vao.setAttributeMulti(transform, shader.attributes[4], gl.FLOAT, 1, Graphics.TRANSFORM_LENGTH, 80, 1); // depth
    // transform matrix 
    vao.setAttributeMatrix(transform, shader.attributes[3], 4, Graphics.TRANSFORM_LENGTH, 0, 4);
    // @ts-ignore
    shader.render = function(projection:mat4, view: mat4, instances: number) {
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.bindVertexArray( vao.object );
        gl.uniformMatrix4fv( shader.uniforms[0], false, projection );
        gl.uniformMatrix4fv( shader.uniforms[1], false, view );
        gl.activeTexture( gl.TEXTURE0 );
        gl.uniform1i( shader.uniforms[2], 0);
        gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, instances);
    }

    return shader;

}
