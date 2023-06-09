import { FC } from "react";
import { Bot } from "../lib/types";
import { useBotsStore } from "../store/bots";

interface BoolBotProps {
    bot: Bot;
    cellSize: number;
}

const BoolBot: FC<BoolBotProps> = ({ bot, cellSize }) => {
    const { color, pos, name, boolValue, dead, speed, intervalId } = bot;
    const kill = useBotsStore((state) => state.kill);
    const timeScale = useBotsStore((state) => state.timeScale);

    return (
        <div
            style={{
                backgroundColor: color,
                top: pos.y * cellSize,
                left: pos.x * cellSize,
                width: `${cellSize}px`,
                height: `${cellSize}px`,
                // transition: `top ${TIMESTEP / 2}ms linear, left ${
                //     TIMESTEP / 2
                // }ms linear, opacity 100ms linear, transform`,
                // opacity: dead ? 0 : 1,
                // scale: dead ? 0.5 : 1,
                transform: `scale(${dead ? 0 : 1})`,
                opacity: `${!dead && !intervalId ? 0.5 : 1}`,
                borderRadius: boolValue === 0 ? "100%" : 0,
                transitionDuration: `${timeScale * 150}ms`,
                transitionTimingFunction: "linear",
            }}
            className="absolute top-0 left-0 aspect-square bg-green-300 border border-primary-900 transition-all flex items-center justify-center"
            onClick={() => {
                // console.log("WHY DELAY");
                kill(name);
            }}
        >
            <div className="flex flex-col gap-0 items-center justify-center leading-none bg-white/50 rounded-full aspect-square px-5">
                <span className="text-xs">{name.slice(0, 5)}..</span>
                <span className="text-sm">{boolValue}</span>
                {/* <span className="text-sm">{operation}</span> */}
                <span>{speed}</span>
            </div>
        </div>
    );
};

export default BoolBot;
