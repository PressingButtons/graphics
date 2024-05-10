export function createBuffer( gl: WebGLRenderingContext | WebGL2RenderingContext, data: Array<number> ) {
    const buffer = gl.createBuffer( );
    if( buffer ) {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        return buffer;
    } else {
        throw 'Error - could not create buffer object.';
    }
}

export function createVAO( gl: WebGL2RenderingContext, program: WebGLProgram, buffer: WebGLBuffer, attributes: {[key:string]: {stride: number, offset: number, size: number}}) {
    const vao = gl.createVertexArray( ) as WebGLVertexArrayObject;
    gl.bindVertexArray( vao );
    gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
    for( const key in attributes ) enableVertexAttribute( gl, program, key, attributes[key])
    gl.bindBuffer( gl.ARRAY_BUFFER, null );
    gl.bindVertexArray( null );
    return vao;
}

export function getUniforms(gl: WebGLRenderingContext | WebGL2RenderingContext, program: WebGLProgram, keys: string[]) {
    const uniforms:{[key:string]: WebGLUniformLocation} = { };
    for( const key of keys ) {
        let location = gl.getUniformLocation( program, key )
        if( location ) uniforms[key] = location
    }
    return uniforms;
}

export function compileShader( gl: WebGLRenderingContext | WebGL2RenderingContext, vertex: string, fragment: string ) {
    let vShader = createShader( gl, vertex, gl.VERTEX_SHADER);
    let fShader = createShader( gl, fragment, gl.FRAGMENT_SHADER );
    return createProgram( gl, vShader, fShader );
}

// internal utility
function createShader( gl: WebGLRenderingContext | WebGL2RenderingContext, source: string, type: number ) {
    const shader = gl.createShader(type);
    if( shader ) {
        gl.shaderSource(shader, source);
        gl.compileShader( shader );
        if( gl.getShaderParameter(shader, gl.COMPILE_STATUS))
            return shader;
        else  {
            const message = gl.getShaderInfoLog( shader );
            gl.deleteShader( shader );
            throw message;
        }
    } else {
        throw `Could not create Shader Object`
    }
}

function createProgram( gl: WebGLRenderingContext | WebGL2RenderingContext, vertex: WebGLShader, fragment: WebGLShader ) {
    const program = gl.createProgram( ) as WebGLProgram;
    gl.attachShader( program, vertex );
    gl.attachShader( program, fragment );
    gl.linkProgram( program );
    if( gl.getProgramParameter( program, gl.LINK_STATUS ))
        return program 
    else {
        const message = gl.getProgramInfoLog( program );
        gl.deleteProgram( program );
        throw message;
    }
}

function enableVertexAttribute(gl: WebGLRenderingContext | WebGL2RenderingContext, program: WebGLProgram, name: string, detail: {stride: number, offset: number, size: number }) {
    const location = gl.getAttribLocation( program, name );
    gl.enableVertexAttribArray( location );
    gl.vertexAttribPointer( location, detail.size, gl.FLOAT, false, detail.stride * 4, detail.offset * 4);
}