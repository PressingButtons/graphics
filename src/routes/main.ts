import type { iModelObject } from "$lib/glib/glib";
import Graphics from "$lib/glib/graphics";
import { loadImage, loadImageData } from "$lib/glib/graphics.utils";

export default async function main( canvas: HTMLCanvasElement ):Promise<void> {

    await Graphics.enable( canvas );

    const models = generateModels( 10 );
    
    await Graphics.setProjection(-1, 1, 1, -1, -1, 1);
    
    await Graphics.loadTexture(0, '/warrior_of_lunn.webp', [160, 160]);
    await Graphics.loadTexture(1, '/palette.webp', [1, 1]);

    let step = 0;
    let depth = 0;

    const projection = [-1, 1, 1, -1, -1, 1];

    const draw = ( ) => {
        for(const model of models) {
            model.rotation[1] += 0.02;
            model.depth = depth % 40;
        }
        step += 1;
        if( step >= 5 ) {
            step = 0;
            depth ++;
        }
        Graphics.draw( projection, [
            { mode: 'color',  models },
            { mode: 'palette',  models }
        ]);
        requestAnimationFrame(draw);
    }

    draw( );

}


const generateModels = (n:number) => {
    let models:iModelObject[] = [];
    for( let i = 0; i < n; i++ )
        models.push({
            position:[Math.random( ) * 2 - 1,Math.random( ) * 2 -1, i],
            rotation:[0,0,0],
            size:[Math.random( ), Math.random( )],
            color:[Math.random( ), Math.random( ), Math.random( ),1],
            depth: 4
        });
    return models
}