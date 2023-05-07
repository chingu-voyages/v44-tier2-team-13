import { FC } from "react";
import { Bot } from "../lib/types";

interface BoolBotProps {
    bot: Bot;
    cellSize: number;
}

const BoolBot: FC<BoolBotProps> = ({ bot, cellSize }) => {
    const { color, pos, name, boolValue, operation } = bot;

    return (
        <div
            style={{
                backgroundColor: color,
                top: pos.y,
                left: pos.x,
                width: `${cellSize}px`,
                height: `${cellSize}px`,
            }}
            className="absolute top-0 left-0 flex flex-col gap-0 items-center justify-center aspect-square bg-green-300 rounded leading-none"
        >
            <span className="text-lg">{name}</span>
            <span className="text-sm">{boolValue}</span>
            <span className="text-sm">{operation}</span>
        </div>
    );
};

export default BoolBot;
