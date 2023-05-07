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
                backgroundColor: color || "#ff0000",
                top: pos.y,
                left: pos.x,
                width: `${cellSize}px`,
                height: `${cellSize}px`,
            }}
            className="absolute top-0 left-0 flex flex-col gap-0 items-center justify-center aspect-square"
        >
            <span>{name}</span>
            <span>{boolValue}</span>
            <span>{operation}</span>
        </div>
    );
};

export default BoolBot;
