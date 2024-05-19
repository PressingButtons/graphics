import Graphics from "../../graphics";
import VAOGener from "../../vaogener";
import ShaderProgram from "../shaderprogram";
import { fragment, vertex } from "./source.color";


export default function generateColorShader( gl: WebGL2RenderingContext, model: WebGLBuffer, transforms:WebGLBuffer) {

    const shader = new ShaderProgram( gl, vertex, fragment );

    shader.findAttributes(gl, ['a_position', 'a_color', 'a_model']);
    shader.findUniforms(gl,  ['u_projection', 'u_view']);

    const vao = new VAOGener( );
    vao.setAttribute(model, shader.attributes[0], gl.BYTE, 3, 5, 0); //position
    vao.setAttributeMatrix(transforms, shader.attributes[2], 4, Graphics.TRANSFORM_LENGTH, 0, 4); // transform
    vao.setAttributeMulti(transforms, shader.attributes[1], gl.FLOAT, 4, Graphics.TRANSFORM_LENGTH, 64, 1 ); //color 

    shader.activate = function( gl: WebGL2RenderingContext ) {
        gl.useProgram( this.program );
    }

    shader.render = function( projection: Float32Array, view: Float32Array, instances: number) {
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.bindVertexArray( vao.object );
        gl.uniformMatrix4fv( shader.uniforms[0], false, projection );
        gl.uniformMatrix4fv( shader.uniforms[1], false, view );
        gl.drawArraysInstanced( gl.TRIANGLE_STRIP, 0, 4, instances );
    }

    return shader;

}

