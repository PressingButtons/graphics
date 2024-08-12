export namespace Graphics {

    let gl:WebGL2RenderingContext;
    let thread:Worker;

    async function send(route:string, content:any, transferables:Transferable[] = []) {
        return new Promise((resolve, reject) => {
            const listener = (event:MessageEvent) => {
                if(route == event.data.route) {
                    thread.removeEventListener('message', listener);
                    resolve(event.data.content);
                }
            }
            thread.addEventListener('message', listener);
            thread.postMessage({route, content}, transferables);
        });
    }

    /** ========================================================
     * ENABLE 
     * @type Public Function
     * @param canvas 
     * @returns void
     */
    export async function enable( canvas:HTMLCanvasElement ) {
        thread = new Worker(new URL('./graphics.thread.ts', import.meta.url), {type:'module'});
        const offscreen = canvas.transferControlToOffscreen( );
        return send('enable', offscreen, [offscreen]);
    }

    /** =========================================================
     * FILL 
     * @param color 
     * @returns void
     */
    export async function fill( color:[number, number, number, number] ) {
        return send('fill', color);
    }

    /** =========================================================
     * DRAW 
     * @param models 
     * @param fill 
     */
    export async function draw( draw_set:DrawSet[], fill:[number, number, number, number] = [0, 0, 0, 1]) {
        return send('draw', {fill, draw_set});
    }

}