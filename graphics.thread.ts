// how to receive messages 
const routes:{[key:string]: (options:any) => any} = { };
// bindings 
self.addEventListener('message', event => {
    if(routes[event.data.route]) {
        postMessage({
            route: event.data.route,
            content: routes[event.data.route](event.data.content)
        });
    }
});


routes.enable = (canvas:OffscreenCanvas) => {

    const gl = canvas.getContext('webgl2') as WebGL2RenderingContext;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // ============================================
    // endpoints 
    // ============================================

    /**
     * routes.fill ( color: quad )
     * fills canvas with rgba color value
     * @param color 
     */
    routes.fill = (color: [number, number, number, number] ) => {
        gl.clearColor(...color);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    /**
     * routes.draw (options: model group, fill: color)
     * draws all models in their given order/group
     * @param options 
     */
    routes.draw = (options:{draw_set:DrawSet[], fill:[number, number, number, number]}) => {
        const {draw_set, fill} = options;
        routes.fill(fill);
        for(const ds of draw_set) drawModels(ds);
    }

    const drawModels = ( ds:DrawSet ) => {
        
    }

}