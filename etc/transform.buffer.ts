import { mat4 } from "gl-matrix";

export default function TransformBuffer( gl: WebGL2RenderingContext ) {

    const NUM_MODELS = 256;
    const MODEL_COMPONENTS = 21;

    const bufferData = new Float32Array(MODEL_COMPONENTS * NUM_MODELS);
    const bufferViews = new Array(NUM_MODELS).fill(0).map((x, i) => bufferData.subarray(i * NUM_MODELS, i * NUM_MODELS + NUM_MODELS));

    const buffer = gl.createBuffer( ) as WebGLBuffer;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.DYNAMIC_DRAW);

    return {
        set: function( models:Model[] ) {
            models.map( (model, i) => {
                const view = bufferViews[i];
                mat4.fromTranslation(view, [...model.position, 0]);
                mat4.rotateX(view, view, model.rotation[0]);
                mat4.rotateY(view, view, model.rotation[1]);
                mat4.rotateZ(view, view, model.rotation[2]);
                mat4.scale(view, view, [...model.size, 0]);
                view.set(model.color, 16);
                view[20] = model.frame || 0;
            });
            return bufferData;
        },
        get buffer( ) {
            return buffer;
        }
    }

}