import type { iModelObject } from "$lib/glib/glib";
import Graphics from "$lib/glib/graphics";
import { loadImage, loadImageData } from "$lib/glib/graphics.utils";

export default async function main( canvas: HTMLCanvasElement ):Promise<void> {
    // create context
    const gl = canvas.getContext('webgl2') as WebGL2RenderingContext;
    // enable graphics with 0.5mb;
    Graphics.enable(gl);

    let models:iModelObject[] = [];
    for( let i = 0; i < 1; i++ ) {
        models.push({
            position:[Math.random( ) * 2 - 1,Math.random( ) * 2 -1, i],
            rotation:[0,0,0],
            size:[Math.random( ), Math.random( )],
            color:[Math.random( ), Math.random( ), Math.random( ),1],
            depth: 4
        })
    };

    const data = await loadImage('/warrior_of_lunn.webp');

    if( data ) {

        Graphics.loadTextureArray(data, 0, [160, 160]);
        Graphics.setProjection(-1, 1, 1, -1, -1, 1);

        let step = 0;
        let depth = 1;
        
        const draw = ( ) => {
            Graphics.fill([0, 0, 0, 0]);
            
            step++;
            if( step >= 6 ) {
                depth++;
                step = 0;
            }
            for(let i = 0; i < models.length; i++ ) {
                models[i].rotation[1] += 0.01;
                models[i].depth = depth % 40;
            }

            Graphics.drawColors(models);
            Graphics.drawTextures(models);
            requestAnimationFrame(draw);
        }

        draw( );
    }
}
