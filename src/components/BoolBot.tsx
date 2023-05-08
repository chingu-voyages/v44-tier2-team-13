import { FC, useEffect, useState } from "react";
import { Bot } from "../lib/types";

interface BoolBotProps {
    bot: Bot;
    cellSize: number;
}

const randomOneOrMinusOne = () => {
    if (Math.random() > 0.5) {
        return -1;
    } else {
        return 1;
    }
};

const BoolBot: FC<BoolBotProps> = ({ bot, cellSize }) => {
    const { color, pos, name, boolValue, operation, direction, speed } = bot;
    const GRIDWIDTH = 8;
    const GRIDHEIGHT = 8;
    const TIMESTEP = 1000 / speed;

    console.log("RE RENDER");

    return (
        <div
            style={{
                backgroundColor: color,
                top: pos.y * cellSize,
                left: pos.x * cellSize,
                width: `${cellSize}px`,
                height: `${cellSize}px`,
                transition: `top ${TIMESTEP / 2}ms linear, left ${
                    TIMESTEP / 2
                }ms linear`,
                borderRadius: boolValue === 0 ? "100%" : 0,
            }}
            className="absolute top-0 left-0 aspect-square bg-green-300 border border-primary-900"
        >
            <div className="flex flex-col gap-0 items-center justify-center leading-none">
                <span className="text-lg">{name}</span>
                <span className="text-sm">{boolValue}</span>
                <span className="text-sm">{operation}</span>
                <span>{direction}</span>
            </div>
        </div>
    );
};

export default BoolBot;
