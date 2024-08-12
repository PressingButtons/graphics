export default function BufferObject( gl:WebGL2RenderingContext ) {
    const buffer = gl.createBuffer( ) as WebGLBuffer;
    return {
        get buffer( ) { return buffer; },
        setData:(data:AllowSharedBufferSource, usage:GLenum) => {
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, data, usage);
        }
    }
}