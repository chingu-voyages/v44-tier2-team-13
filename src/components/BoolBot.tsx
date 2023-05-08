import { FC } from "react";
import { Bot } from "../lib/types";
import { useBotsStore } from "../store/bots";

interface BoolBotProps {
    bot: Bot;
    cellSize: number;
}

const BoolBot: FC<BoolBotProps> = ({ bot, cellSize }) => {
    const { color, pos, name, boolValue, direction, dead, speed } = bot;
    const TIMESTEP = 1000 / speed;
    const kill = useBotsStore((state) => state.kill);

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
                borderRadius: boolValue === 0 ? "100%" : 0,
            }}
            className="absolute top-0 left-0 aspect-square bg-green-300 border border-primary-900 transition-all"
        >
            <div
                className="flex flex-col gap-0 items-center justify-center leading-none"
                onClick={() => {
                    // console.log("WHY DELAY");
                    kill(name);
                }}
            >
                <span className="text-lg">{name}</span>
                <span className="text-sm">{boolValue}</span>
                {/* <span className="text-sm">{operation}</span> */}
                <span>
                    {pos.x}, {pos.y}
                </span>
            </div>
        </div>
    );
};

export default BoolBot;
