import type { iModelObject } from './glib';
import { loadImageData  } from './graphics.utils';
import { mat4, type vec2 } from 'gl-matrix';

let worker:Worker;

const send = ( route: string, data: any, transferables:Transferable[] = []) => {
    const message = { route, data };
    return new Promise((resolve, reject) => {
        const delivery = (e:MessageEvent) => {
            if(e.data.route != route) return;
            resolve(e.data);
            worker.removeEventListener('message', delivery);
        }
        worker.addEventListener('message', delivery);
        worker.postMessage(message, transferables);
    });
}


export default class Graphics {

    static TRANSFORM_LENGTH = 21 * 4;
    static TRANSFORM_INSTANCES = 1000;

    private constructor( ) { }

    public static async enable( canvas: HTMLCanvasElement ) {
        const url = new URL('./g.worker.ts', import.meta.url);
        worker = new Worker(url, {type: 'module'});
        const offscreen = canvas.transferControlToOffscreen( );
        await send('init', offscreen, [offscreen]);
    }

    public static async loadTexture( index: number, url: string, size?: vec2 ) {
        const source = await loadImageData( url );
        if( source ) {
            send('texture', {source, size, index} );
        }
    }

    // projetion and view modification 
    public static setProjection(left: number, right: number, bottom: number, top: number, near: number, far: number ) {
        return send('projection', {left, right, bottom, top, near, far});
    }

    // draw methods 
    public static draw( projection: number[], requests:{ mode: string, models: iModelObject[]}[] ) {
        const outdata = { projection, requests };
        return send('draw', outdata );
    }

}