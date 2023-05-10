import { FC, useEffect } from "react";
import { Bots } from "../lib/types";
import BoolBot from "./BoolBot";
import { useBotsStore } from "../store/bots";

interface GridProps {
    cellSize: number;
}

const Grid: FC<GridProps> = ({ cellSize }) => {
    const bots: Bots = useBotsStore((state) => state.bots);
    const running = useBotsStore((state) => state.running);
    const timeScale = useBotsStore((state) => state.timeScale);

    const start = useBotsStore((state) => state.start);
    const stop = useBotsStore((state) => state.stop);
    const nextStep = useBotsStore((state) => state.nextStep);
    const setTimeScaleWhileRunning = useBotsStore(
        (state) => state.setTimeScaleWhileRunning
    );

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

                    {Object.values(bots).map((bot) => (
                        <BoolBot key={bot.name} bot={bot} cellSize={cellSize} />
                    ))}
                </div>
                {/* <span className="text-white">{bots.length}</span> */}
                <div className="flex items-center justify-center gap-5">
                    <button
                        className="px-5 py-2 bg-white rounded-md"
                        onClick={running ? stop : start}
                    >
                        {running ? "PAUSE" : "BATTLE"}
                    </button>
                    <button
                        className="px-5 py-2 bg-white rounded-md"
                        onClick={nextStep}
                        disabled={running}
                    >
                        Next Step
                    </button>
                </div>
                <div className="flex items-center justify-between text-white">
                    <span className="">
                        Num of Bots alive:{" "}
                        {Object.values(bots).filter((bot) => !bot.dead).length}
                    </span>
                    <span>
                        Num of 1 bots:{" "}
                        {
                            Object.values(bots).filter(
                                (bot) => bot.boolValue === 1 && !bot.dead
                            ).length
                        }
                    </span>
                    <span>
                        Num of 0 bots:{" "}
                        {
                            Object.values(bots).filter(
                                (bot) => bot.boolValue === 0 && !bot.dead
                            ).length
                        }
                    </span>
                </div>
                <div className="text-white flex items-center justify-center gap-2">
                    <label htmlFor="timescale">Time Scale</label>
                    <input
                        type="range"
                        name="timescale"
                        id="timescale"
                        min={0.1}
                        max={2}
                        step={0.1}
                        defaultValue={timeScale}
                        onChange={(e) => {
                            setTimeScaleWhileRunning(
                                parseFloat(e.currentTarget.value)
                            );
                        }}
                        // disabled={running}
                    />
                    {timeScale.toFixed(1)}
                </div>
            </div>
        </>
    );
};

export default Grid;
