import { FC } from "react";
import { Bot, Operation } from "../lib/types";
import BoolBot from "./BoolBot";

interface GridProps {
    cellSize: number;
}

const Grid: FC<GridProps> = ({ cellSize }) => {
    const bots: Bot[] = [
        {
            name: "A",
            boolValue: 0,
            operation: Operation.AND,
            pos: { x: 3, y: 7 },
            speed: 2,
            startDirection: "up",
            color: "blue",
        },
        {
            name: "B",
            boolValue: 1,
            operation: Operation.OR,
            pos: { x: 0, y: 2 },
            speed: 4,
            startDirection: "down",
            color: "green",
        },
        {
            name: "C",
            boolValue: 0,
            operation: Operation.NOT,
            pos: { x: 3, y: 2 },
            speed: 1,
            startDirection: "right",
            color: "red",
        },
    ];

    return (
        <div
            style={{ minWidth: cellSize * 8 }}
            className="grid grid-cols-8 grid-rows-[8] relative"
        >
            {Array.from({ length: 64 }).map((_, i) => (
                <span
                    key={i}
                    style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
                    className="border border-primary-900 aspect-square bg-primary-600"
                >
                    {i}
                </span>
            ))}

            {bots.map((bot) => (
                <BoolBot
                    allBots={bots}
                    key={bot.name}
                    bot={bot}
                    cellSize={cellSize}
                />
            ))}
        </div>
    );
};

export default Grid;
