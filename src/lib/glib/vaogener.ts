let gl:WebGL2RenderingContext;

export default class VAOGener {

    public static enable( contextWebgl2: WebGL2RenderingContext ) {
        gl = contextWebgl2;
    }

    private _vao: WebGLVertexArrayObject;

    constructor( ) {
        this._vao = gl.createVertexArray( ) as WebGLVertexArrayObject;
    }

    hook( buffer: WebGLBuffer ) {
        gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
        gl.bindVertexArray( this._vao );
    }

    unhook( ) {
        gl.bindBuffer( gl.ARRAY_BUFFER, null );
        gl.bindVertexArray( null );
    }

    setAttribute( buffer: WebGLBuffer, location: number, type: number, size: number, stride: number, offset: number ) {
        // set context 
        this.hook( buffer );
        // setup attribute 
        gl.enableVertexAttribArray( location );
        gl.vertexAttribPointer( location, size, type, false, stride, offset );
        // divorce context 
        this.unhook( );
    }

    setAttributeMatrix( buffer: WebGLBuffer, location: number, size: number, stride: number, offset: number, repetitions: number ) {
          // set context 
          this.hook( buffer );
          // setup attribute 
          for( let i = 0; i < repetitions; i++ ) {
             const attrLoc = location + i;
             gl.vertexAttribPointer( attrLoc, size, gl.FLOAT, false, stride, offset + i * 16 );
             gl.vertexAttribDivisor( attrLoc, 1 );
             gl.enableVertexAttribArray( attrLoc );
          }
          // divorce contex
          this.unhook( );
    }

    setAttributeMulti( buffer: WebGLBuffer, location: number, type: number, size: number, stride: number, offset: number, repetitions: number ) {
         // set context 
         this.hook( buffer );
         // setup attribute 
         for( let i = 0; i < repetitions; i++ ) {
            const attrLoc = location + i;
            gl.vertexAttribPointer( attrLoc, size, type, false, stride, offset );
            gl.vertexAttribDivisor( attrLoc, 1 );
            gl.enableVertexAttribArray( attrLoc );
         }
         // divorce contex
         this.unhook( );
    }

    get object( ) {
        return this._vao;
    }

}