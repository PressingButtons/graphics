interface Model {
    shader: string,
    size: [number, number];
    position: [number, number];
    rotation: [number, number, number];
    color: [number, number, number, number];
    texture?: string;
    frame?: number;
}

interface DrawSet {
    shader: string, 
    models: Model[],
    texture?: string
}