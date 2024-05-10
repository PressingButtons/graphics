const shaderSources = {
    color: {
        fragment: `#version 300 es

        precision highp float;
        
        uniform vec4 uColor;
        out vec4 outColor;
        
        void main( ) {
            outColor = uColor;
        }`,
        vertex: `#version 300 es

        in vec3 aPosition;
        
        uniform mat4 uProjection;
        uniform mat4 uTransform;
        
        void main( ) {
            vec4 position = vec4(aPosition, 1);
            gl_Position = uProjection * uTransform * position;
        }`
    },
    line: {
        vertex: `#version 300 es

        in vec3 aPosition;
        
        uniform mat4 uProjection;
        uniform mat4 uTransform;
        
        void main( ) {
            vec4 position = vec4(aPosition, 1);
            gl_Position =  uProjection * uTransform * position;
        }`
    },
    texture: {
        fragment: `#version 300 es

        precision highp float;
        
        uniform sampler2D uTexture;
        in vec2 vTexCoord;
        out vec4 outColor;
        
        void main( ) {
            ivec2 size = textureSize(uTexture, 0);
            vec2 position = vTexCoord / vec2( size );
            outColor = texture(uTexture, position);
        }`,
        vertex: `#version 300 es

        in vec3 aPosition;
        
        uniform mat4 uProjection;
        uniform mat4 uTransform;
        uniform mat4 uTexTransform;
        
        out vec2 vTexCoord;
        
        void main( ) {
            vec4 position = vec4(aPosition, 1);
            gl_Position = uProjection * uTransform * position;
            vTexCoord = (uTexTransform * position).xy;
        }`
    }
}

export default shaderSources;