import { FC, useEffect } from "react";
import { Bot, Operation } from "../lib/types";
import BoolBot from "./BoolBot";
import { useBotsStore } from "../store/bots";

interface GridProps {
    cellSize: number;
}

const Grid: FC<GridProps> = ({ cellSize }) => {
    const bots: Bot[] = useBotsStore((state) => state.bots);
    const start = useBotsStore((state) => state.start);

    useEffect(() => {
        const intervalIds = start();

        return () => {
            intervalIds.forEach((id) => {
                clearInterval(id);
            });
        };
    }, []);

    return (
        <div
            style={{ minWidth: cellSize * 8 }}
            className="grid grid-cols-8 grid-rows-[8] relative"
        >
            {Array.from({ length: 8 }).map((_, i) =>
                Array.from({ length: 8 }).map((_, j) => (
                    <span
                        key={`${i}, ${j}`}
                        style={{
                            width: `${cellSize}px`,
                            height: `${cellSize}px`,
                        }}
                        className="border border-primary-900 aspect-square bg-primary-600 leading-none"
                    >
                        {i}, {j}
                    </span>
                ))
            )}

            {bots.map((bot) => (
                <BoolBot key={bot.name} bot={bot} cellSize={cellSize} />
            ))}
        </div>
    );
};

export default Grid;
