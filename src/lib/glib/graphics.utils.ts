import type { vec2 } from "gl-matrix";

export function createBuffer( gl: WebGL2RenderingContext, data:AllowSharedBufferSource, usage: number ) {
    const buffer = gl.createBuffer( ) as WebGLBuffer;;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data ,usage );
    gl.bindBuffer(gl.ARRAY_BUFFER, null ); // unlink buffer
    return buffer;
}

export function updateBuffer( gl: WebGL2RenderingContext, buffer: WebGLBuffer, data: AllowSharedBufferSource, offset:number = 0 ) {
    gl.bindBuffer( gl.ARRAY_BUFFER, buffer);
    gl.bufferSubData( gl.ARRAY_BUFFER, offset, data);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

export function setTexture( gl: WebGL2RenderingContext, texture: WebGLTexture, source:HTMLImageElement | ImageData ) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, source.width, source.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, source );
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
}

export function setTextureArray( gl: WebGL2RenderingContext, texture: WebGLTexture, source: HTMLImageElement | ImageData, size?:number[], slices: number = 1 ) {
    if(!size) size = [source.width, source.height];
    gl.bindTexture(gl.TEXTURE_2D_ARRAY, texture );
    gl.texImage3D(gl.TEXTURE_2D_ARRAY, 0, gl.RGBA, size[0], size[1], slices, 0, gl.RGBA, gl.UNSIGNED_BYTE, source);
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.NEAREST);  
}

export function loadImage( url: string ):Promise<HTMLImageElement | null> {
    return new Promise((resolve,reject) => {
        const image = new Image( );
        image.onload = ( ) => resolve(image);
        image.onerror = ( ) => reject(null);
        image.src = url;
    });
}

export function getImageData( image: HTMLImageElement ) {
    const canvas = new OffscreenCanvas( image.width, image.height );
    const ctx = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;
    ctx.drawImage( image, 0, 0 );
    return ctx.getImageData(0, 0, image.width, image.height);
}

export async function loadImageData( url: string):Promise<ImageData|null>  {
    const image = await loadImage( url );
    if( !image ) return null;
    return getImageData( image );
}