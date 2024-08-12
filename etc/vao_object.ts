export default function createVAO( gl: WebGL2RenderingContext, program: WebGLProgram ) {
    const vao = gl.createVertexArray( );

    return {

        get object( ) {
            return vao
        },

        setAttribute( buffer:WebGLBuffer, name: string, size:number, type:GLenum, stride:number, offset: number) {
            const location = gl.getAttribLocation(program, name);
            if( location == -1 ) throw `Invalid attribute[${name}]`;
            // set vao
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bindVertexArray( vao );
            // set attribute 
            gl.enableVertexAttribArray( location );
            gl.vertexAttribPointer( location, size, type, false, stride, offset );            
        },

        setAttributeMatrix( buffer: WebGLBuffer, name:string, stride:number, offset:number ) {
            const location = gl.getAttribLocation(program, name);
            if( location == -1 ) throw `Invalid attribute[${name}]`;
            // set vao
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bindVertexArray( vao );
            // set attribute 
            for( let i = 0; i < 4; i++ ) {
                const loc = location + i;
                gl.enableVertexAttribArray( loc );
                gl.vertexAttribDivisor( loc, 1 );
                gl.vertexAttribPointer( loc, 4, gl.FLOAT, false, stride, offset + i * 16 );  
            }
        },

        setiAttributeMulti( buffer:WebGLBuffer, name:string, size:number, type:GLenum, stride:number, offset:number ) {
            const location = gl.getAttribLocation(program, name);
            if( location == -1 ) throw `Invalid attribute[${name}]`;
             // set vao
             gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
             gl.bindVertexArray( vao );
             // set attribute 
             for( let i = 0; i < 4; i++ ) {
                 const loc = location + i;
                 gl.enableVertexAttribArray( loc );
                 gl.vertexAttribDivisor( loc, 1 );
                 gl.vertexAttribPointer( loc, 4, type, false, stride, offset );  
             }
        }

    }

}