import * as glMatrix from 'gl-matrix';
import ShaderProgram from './programs/shaderprogram';
import VAOGener from './vaogener';
import generateColorShader from './programs/color/program.color';
import { createBuffer, setTexture, setTextureArray, updateBuffer } from './graphics.utils';
import generateTextureShader from './programs/texture/program.texture';
import type { iModelObject } from './glib';

// global variables 
const mat4 = glMatrix.mat4;
let gl:WebGL2RenderingContext;
const transformLength = 21;
const transformInstances = 1000;
//shaders
const shaders:{[key:string]:ShaderProgram} = { };
// vertices 
let modelVertex:Int8Array = new Int8Array([
    -1, -1, 0,   0, 0,
    -1,  1, 0,   0, 1,
     1, -1, 0,   1, 0,
     1,  1, 0,   1, 1
]);

const transformVertex:Float32Array = new Float32Array(transformLength * transformInstances);
const transformViews:Float32Array[] = [];
for( let i = 0; i < transformInstances; i++ ) {
    const offset = i * transformLength;
    transformViews.push(transformVertex.subarray(offset, offset + transformLength));
}

let transformBuffer:WebGLBuffer;

const projection = mat4.create( );
const view = mat4.create( );



export default class Graphics {
    
    public static TRANSFORM_LENGTH = transformLength * 4;
    public static shaders:{[key:string]: ShaderProgram } = { };
    public static textures:WebGLTexture[] = [];

    private constructor( ) { }

    public static enable( context: WebGL2RenderingContext) {
        gl = context;
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        VAOGener.enable( context );
        // create textures 
        while( Graphics.textures.length < 2 ) 
            Graphics.textures.push(gl.createTexture( ) as WebGLTexture);
        // create shaders 
        Graphics._createDefaultShaders( );
    }

    private static _createDefaultShaders( ) {
        const modelBuffer = createBuffer(gl, modelVertex, gl.STATIC_DRAW);
        transformBuffer = createBuffer(gl, transformVertex, gl.DYNAMIC_DRAW);
        Graphics.shaders.color = generateColorShader( gl, modelBuffer, transformBuffer );
        Graphics.shaders.texture = generateTextureShader( gl, modelBuffer, transformBuffer );
    }

    private static updateTransforms( model:iModelObject ) {
        const matrix = transformViews[model.position[2]];
        mat4.fromTranslation(matrix, [model.position[0], model.position[1], 0]);
        mat4.rotateX( matrix, matrix, model.rotation[0]);
        mat4.rotateY( matrix, matrix, model.rotation[1]);
        mat4.rotateZ( matrix, matrix, model.rotation[2]);
        mat4.scale( matrix, matrix, [...model.size, 1] as glMatrix.vec3);
        // color setting 
        matrix.set(model.color, 16);
        matrix[20] = Math.max(1, model.depth);
    }

    public static fill(color:glMatrix.vec4) {
        gl.clearColor(color[0], color[1], color[2], color[3]);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    public static loadTexture( source: ImageData | HTMLImageElement, index: number = 0 ) {
        setTexture( gl, Graphics.textures[index], source );
    }

    public static loadTextureArray( source: ImageData | HTMLImageElement, index: number, size?:glMatrix.vec2 ) {
        if( !size ) size = [source.width, source.height];
        let slices = Math.floor(source.height / size[1] );
        setTextureArray( gl, Graphics.textures[index], source, size, slices );
    }

    // projetion and view modification 
    public static setProjection(left: number, right: number, bottom: number, top: number, near: number, far: number ) {
        mat4.ortho(projection, left, right, bottom ,top, near, far);
    }

    // draw methods 
    public static drawColors( models:iModelObject[] ) {
        for(const model of models) Graphics.updateTransforms( model );
        updateBuffer(gl, transformBuffer, transformVertex, 0);
        Graphics.shaders.color.activate( gl );
        Graphics.shaders.color.render( projection, view, models.length );
    }

    public static drawTextures( models:iModelObject[] ) {
        for( const model of models ) Graphics.updateTransforms( model );
        updateBuffer(gl, transformBuffer, transformVertex, 0);
        Graphics.shaders.texture.activate(gl);
        Graphics.shaders.texture.render(projection, view, Graphics.textures[0], models.length);
    }

}