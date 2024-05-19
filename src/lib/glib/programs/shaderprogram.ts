import type { mat4 } from "gl-matrix";

export default class ShaderProgram {

    uniforms:(WebGLUniformLocation|null)[] = [];
    attributes:number[] = [];
    program: WebGLProgram;

    constructor( gl: WebGL2RenderingContext, vertex: string, fragment: string ) {
        this.program = this._compile( gl, vertex, fragment ); 
    }

    private _compile( gl: WebGL2RenderingContext, vertex: string, fragment: string ) {
        const vShader = this._createShader( gl, vertex, gl.VERTEX_SHADER );
        const fShader = this._createShader( gl, fragment, gl.FRAGMENT_SHADER );
        const program = this._createProgam( gl, vShader, fShader );
        return program;
    }

    private _createShader( gl: WebGL2RenderingContext, source: string, type: number ) {
        const shader = gl.createShader( type ) as WebGLShader;
        gl.shaderSource( shader, source );
        gl.compileShader( shader );
        return shader;
    }

    private _createProgam( gl: WebGL2RenderingContext, vertex: WebGLShader, fragment: WebGLShader ) {
        const program = gl.createProgram( ) as WebGLProgram;
        gl.attachShader( program, vertex );
        gl.attachShader( program, fragment );
        gl.linkProgram( program );
        return program as WebGLProgram;
    }

    findAttributes( gl: WebGL2RenderingContext, names: string[] ) {
        this.attributes = names.map( name => gl.getAttribLocation(this.program, name) );
    }

    findUniforms( gl: WebGL2RenderingContext, names: string[] ) {
        this.uniforms = names.map( name => gl.getUniformLocation(this.program, name) );
    }

    activate( gl: WebGL2RenderingContext ) {
        gl.useProgram( this.program );
    }

    render( projection: mat4, view: mat4, instances: number ):void;
    render( projection: mat4, view: mat4, texture: WebGLTexture, instances: number ):void;
    render( projection: mat4, view: mat4, texture: WebGLTexture, palette:WebGLTexture, instances: number ):void;
    render( ...parmas:any[] ):void {

    }
}