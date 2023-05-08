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
    const stop = useBotsStore((state) => state.stop);
    const running = useBotsStore((state) => state.running);
    useEffect(() => {
        // start();

        // Necessary to clear the timeouts
        return () => {
            stop();
        };
    }, []);

    return (
        <>
            <div className="flex flex-col gap-2">
                <div
                    style={{ minWidth: cellSize * 8 }}
                    className="grid grid-cols-8 grid-rows-[8] relative select-none"
                >
                    {Array.from({ length: 8 }).map((_, i) =>
                        Array.from({ length: 8 }).map((_, j) => (
                            <span
                                key={`${j}, ${i}`}
                                style={{
                                    width: `${cellSize}px`,
                                    height: `${cellSize}px`,
                                }}
                                className="border border-primary-900 aspect-square bg-primary-600 leading-none"
                            >
                                {j}, {i}
                            </span>
                        ))
                    )}

                    {bots.map((bot) => (
                        <BoolBot key={bot.name} bot={bot} cellSize={cellSize} />
                    ))}
                </div>
                {/* <span className="text-white">{bots.length}</span> */}
                <button
                    className="px-5 py-2 bg-white rounded-md"
                    onClick={running ? stop : start}
                >
                    {running ? "PAUSE" : "BATTLE"}
                </button>
            </div>
        </>
    );
};

export default Grid;
