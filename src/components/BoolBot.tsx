import { FC, useEffect, useState } from "react";
import { Bot } from "../lib/types";

interface BoolBotProps {
    bot: Bot;
    cellSize: number;
}

const randomOneOrMinusOne = () => {
    if (Math.random() > 0.5) {
        return -1;
    } else {
        return 1;
    }
};

const BoolBot: FC<BoolBotProps> = ({ bot, cellSize }) => {
    const { color, pos, name, boolValue, operation, startDirection, speed } =
        bot;
    const GRIDWIDTH = 8;
    const GRIDHEIGHT = 8;
    const TIMESTEP = 1000 / speed;

    const [x, setX] = useState(pos.x);
    const [y, setY] = useState(pos.y);
    const [vx, setVx] = useState(
        startDirection === "right" ? 1 : startDirection === "left" ? -1 : 0
    );
    const [vy, setVy] = useState(
        startDirection === "down" ? 1 : startDirection === "up" ? -1 : 0
    );

    const updatePosition = () => {
        setX((x) => x + vx);
        setY((y) => y + vy);
    };

    const updateVelocity = () => {
        // TODO: prevent bots from moving in circles
        if (x >= GRIDWIDTH - 1 && vx > 0) {
            setVx(0);
            setVy(randomOneOrMinusOne());
        } else if (x <= 0 && vx < 0) {
            setVx(0);
            setVy(randomOneOrMinusOne());
        }

        if (y >= GRIDHEIGHT - 1 && vy > 0) {
            setVy(0);
            setVx(randomOneOrMinusOne());
        } else if (y <= 0 && vy < 0) {
            setVy(0);
            setVx(randomOneOrMinusOne());
        }
    };

    useEffect(() => {
        updateVelocity();
    }, [updateVelocity]);

    useEffect(() => {
        const updateId = setInterval(updatePosition, TIMESTEP);
        return () => {
            clearInterval(updateId);
        };
    }, [updatePosition]);

    return (
        <div
            style={{
                backgroundColor: color,
                top: y * cellSize,
                left: x * cellSize,
                width: `${cellSize}px`,
                height: `${cellSize}px`,
                transition: `top ${TIMESTEP / 2}ms linear, left ${
                    TIMESTEP / 2
                }ms linear`,
            }}
            className="absolute top-0 left-0 flex flex-col gap-0 items-center justify-center aspect-square bg-green-300 rounded leading-none"
        >
            <span className="text-lg">{name}</span>
            <span className="text-sm">{boolValue}</span>
            <span className="text-sm">{operation}</span>
            <span>
                {vx}, {vy}
            </span>
        </div>
    );
};

export default BoolBot;
