export enum Operation {
    AND = "and",
    OR = "or",
    NOR = "nor",
    XOR = "xor",
}

export interface Vector {
    x: number;
    y: number;
}

export interface Bot {
    name: string;
    boolValue: 0 | 1;
    // operation: Operation;
    dead: boolean;
    direction: Vector;
    speed: number;
    pos: Vector;
    color?: string;
}
