import { mat4, vec2, vec3, vec4 } from "gl-matrix";
import type { iModelObject } from "./glib";
import { createBuffer, setTextureArray, updateBuffer } from "./graphics.utils";
import generateColorShader from "./programs/color/program.color";
import generatePaletteShader from "./programs/palette/program.palette";
import type ShaderProgram from "./programs/shaderprogram";
import generateTextureShader from "./programs/texture/program.texture";
import VAOGener from "./vaogener";
import Graphics from "./graphics";

// constants
const TRANSFORM_INSTANCES = Graphics.TRANSFORM_INSTANCES;
const TRANSFORM_LENGTH = Graphics.TRANSFORM_LENGTH / 4;
const modelVertex = new Int8Array([
    -1, -1, 0,   0, 0,
    -1,  1, 0,   0, 1,
     1, -1, 0,   1, 0,
     1,  1, 0,   1, 1
]);
const transformVertex = new Float32Array(TRANSFORM_INSTANCES * TRANSFORM_LENGTH);
const views:Float32Array[] = [];
while(views.length < transformVertex.length) {
    const offset = views.length * TRANSFORM_LENGTH;
    const view = transformVertex.subarray(offset, offset + TRANSFORM_LENGTH);
    views.push(view);
}
// global variables 
const textures:WebGLTexture[] = [];
const shaders:{[key:string]:ShaderProgram} = {};

// messaging object
const messenger = (( ) => {

    const routes:{[key:string]:Function} = { };

    self.onmessage = async( event: MessageEvent ) => {
        const message = event.data;
        if( routes[message.route] ) {
            const result = await routes[message.route]( message.data );
            return postMessage({ route: message.route, data: result });
        } 
        return postMessage({route: message.route, data: null });
    }

    return {
        on: function( route: string, method: Function ) {
            routes[route] = method;
        }
    }

})( );


messenger.on('init', async (canvas: OffscreenCanvas) =>{
    const gl = canvas.getContext('webgl2') as WebGL2RenderingContext;
    // initializing components 
    VAOGener.enable(gl);
    // setup blending operation 
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    // setup buffers 
    const modelBuffer = createBuffer(gl, modelVertex, gl.STATIC_DRAW);
    const transformBuffer = createBuffer(gl, transformVertex, gl.DYNAMIC_DRAW);
    // create texture objects 
    while(textures.length < 2) textures.push( gl.createTexture( ) as WebGLTexture );
    // create view projection matrices
    const projection = mat4.create( );
    const view = mat4.create( );
    // setup shaders 
    shaders.color = generateColorShader( gl, modelBuffer, transformBuffer );
    shaders.palette = generatePaletteShader( gl, modelBuffer, transformBuffer );
    shaders.texture = generateTextureShader( gl, modelBuffer, transformBuffer );
    /* ==========================================
        methods
    * =========================================== */
    const draw = (request: {mode: string, models: iModelObject[]}) => {
        const shader = shaders[request.mode];
        if(!shader) return;
        setTransforms( request.models );
        updateBuffer( gl, transformBuffer, transformVertex );
        shader.activate( gl );
        shader.render( projection, view, request.models.length );
    }
    // place data in transform buffer
    const setTransforms = (models: iModelObject[] ) => {
        for(const model of models) {
            const matrix = views[model.position[2]];
            mat4.fromTranslation(matrix, [model.position[0], model.position[1], 0]);
            mat4.rotateX( matrix, matrix, model.rotation[0]);
            mat4.rotateY( matrix, matrix, model.rotation[1]);
            mat4.rotateZ( matrix, matrix, model.rotation[2]);
            mat4.scale( matrix, matrix, [...model.size, 1] as vec3);
            // color setting 
            matrix.set(model.color, 16);
            matrix[20] = Math.max(1, model.depth);
        }
    }
    // setup messaging routes 
    messenger.on('draw', async(data:{projection:number, requests:{mode: string, models: iModelObject[]}[]}) => {
        // @ts-ignore
        mat4.ortho(projection, ...data.projection);
        for(const request of data.requests) draw( request );
    });
    // load texture into cache 
    messenger.on('texture', async( data: {source: ImageData, index: number, size?:number[] }) => {
        let {source, index, size} = data;
        if( !size ) size = [source.width, source.height];
        const slices = Math.floor( source.height / size[1] );
        gl.activeTexture( gl.TEXTURE0 + index );
        setTextureArray( gl, textures[index], source, size, slices );
        });

    console.log('Graphics initialized');
    return true;
});