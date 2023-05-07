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
            pos: { x: 0, y: 0 },
            speed: 1,
            startDirection: "right",
        },
    ];

    return (
        <div className="grid grid-cols-8 grid-rows-[8] relative">
            {Array.from({ length: 64 }).map((_) => (
                <span
                    style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
                    className="border border-primary-900 aspect-square bg-primary-600"
                ></span>
            ))}

            {bots.map((bot) => (
                <BoolBot bot={bot} cellSize={cellSize} />
            ))}
        </div>
    );
};

export default Grid;
