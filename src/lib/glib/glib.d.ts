import type { vec2, vec3, vec4 } from "gl-matrix";

interface iModelObject {
    position:vec3,
    rotation:vec3,
    size:vec2,
    color:vec4,
    depth:number
}

interface iGLibMessage {
    route: string;
    data: any;
}