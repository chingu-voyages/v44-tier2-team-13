export enum Operation {
    AND = "and",
    OR = "or",
    NOT = "not",
    XOR = "xor",
}

export interface Vector {
    x: number;
    y: number;
}

export interface Bot {
    name: string;
    boolValue: 0 | 1;
    operation: Operation;
    startDirection: "up" | "right" | "down" | "left";
    speed: number;
    pos: Vector;
    color?: string;
}
