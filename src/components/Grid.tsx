import { FC, useEffect } from "react";
import BoolBot from "./BoolBot";
import { useBotsStore } from "../store/bots";

interface GridProps {
    cellSize: number;
}

const Grid: FC<GridProps> = ({ cellSize }) => {
    const bots = useBotsStore((state) => state.bots);
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
                            ></span>
                        ))
                    )}

                    {[...bots].map(([key, bot]) => (
                        <BoolBot key={key} bot={bot} cellSize={cellSize} />
                    ))}
                </div>
                {/* <span className="text-white">{bots.length}</span> */}
                <div className="flex items-center justify-center gap-5">
                    <button
                        className="mt-10 w-48 h-12 text-2xl font-Inter font-bold px-5 py-2 bg-[#F983AD] rounded-md"
                        onClick={running ? stop : start}
                    >
                        {running ? "PAUSE" : "BATTLE!"}
                    </button>
                </div>
            </div>
        </>
    );
};

export default Grid;
