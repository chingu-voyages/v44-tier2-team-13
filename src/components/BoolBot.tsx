import { FC, useEffect, useState } from "react";
import { Bot } from "../lib/types";

interface BoolBotProps {
    bot: Bot;
    allBots: Bot[];
    cellSize: number;
}

const randomOneOrMinusOne = () => {
    if (Math.random() > 0.5) {
        return -1;
    } else {
        return 1;
    }
};

const BoolBot: FC<BoolBotProps> = ({ bot, allBots, cellSize }) => {
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

    const checkCollision = () => {
        const otherBots = allBots.filter((bot) => bot.name !== name);
        otherBots.forEach((obot, i) => {
            console.log(obot.pos, obot.name);
        });
    };

    const updatePosition = () => {
        checkCollision();
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
                borderRadius: boolValue === 0 ? "100%" : 0,
            }}
            className="absolute top-0 left-0 aspect-square bg-green-300 border border-primary-900"
        >
            <div className="flex flex-col gap-0 items-center justify-center leading-none">
                <span className="text-lg">{name}</span>
                <span className="text-sm">{boolValue}</span>
                <span className="text-sm">{operation}</span>
                <span>
                    {vx}, {vy}
                </span>
            </div>
        </div>
    );
};

export default BoolBot;
