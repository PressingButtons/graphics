// global variables 
let gl:WebGL2RenderingContext;
let buffer:ArrayBuffer;

export default class Graphics {

    private constructor( ) { }

    public static enable( gl: WebGL2RenderingContext, display_chunks: number = 100) {
        gl = gl;
        buffer = new ArrayBuffer(DisplayChunk.CHUNK_SIZE * display_chunks);
    }

}

class DisplayChunk {
    // model - color - texture_number - texture_depth
    static CHUNK_SIZE:number = 16 * Int16Array.BYTES_PER_ELEMENT + 4 * Float32Array.BYTES_PER_ELEMENT + 2 * Int16Array.BYTES_PER_ELEMENT;

    private _model:Int16Array;
    private _color:Float32Array;
    private _texData:Uint16Array; 

    constructor( buffer: ArrayBuffer, offset:number ) {

    }

    transform( )

}