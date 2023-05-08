import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Bot, Operation, Vector } from "../lib/types";

const randomOneOrMinusOne = () => {
    if (Math.random() > 0.5) {
        return -1;
    } else {
        return 1;
    }
};

interface BotsState {
    bots: Bot[];
    createNew: (bot: Bot) => void;
    // setPosition: (botName: string, newPos: Vector) => void;
    update: (botName: string) => void;
    start: () => number[];
}

export const useBotsStore = create<BotsState>()((set, get) => ({
    bots: [
        {
            name: "A",
            boolValue: 0,
            operation: Operation.AND,
            pos: { x: 3, y: 7 },
            speed: 2,
            direction: { x: 0, y: -1 }, // up
            color: "blue",
        },
        {
            name: "B",
            boolValue: 1,
            operation: Operation.OR,
            pos: { x: 0, y: 2 },
            speed: 4,
            direction: { x: 0, y: 1 }, // down
            color: "green",
        },
        {
            name: "C",
            boolValue: 0,
            operation: Operation.NOT,
            pos: { x: 3, y: 2 },
            speed: 1,
            direction: { x: 1, y: 0 }, // right
            color: "red",
        },
    ],

    createNew: (bot) =>
        set((state) => {
            return { bots: [...state.bots, bot] };
        }),

    // setPosition: (botName, newPos) =>
    //     set((state) => {
    //         const bots = [...state.bots];
    //         bots.forEach((bot) => {
    //             if (bot.name === botName) {
    //                 bot.pos = newPos;
    //                 return;
    //             }
    //         });
    //         return { bots };
    //     }),

    update: (botName) =>
        set((state) => {
            const bots = [...state.bots];
            bots.forEach((bot) => {
                if (botName !== bot.name) return;
                // TODO: Prevent bots from spinning in circles on the border
                bot.pos.x += bot.direction.x;
                bot.pos.y += bot.direction.y;
                if (bot.pos.x >= 8 - 1 && bot.direction.x > 0) {
                    bot.direction.x = 0;
                    bot.direction.y = randomOneOrMinusOne();
                    bot.pos.x = 7;
                } else if (bot.pos.x <= 0 && bot.direction.x < 0) {
                    bot.direction.x = 0;
                    bot.direction.y = randomOneOrMinusOne();
                    bot.pos.x = 0;
                }

                if (bot.pos.y >= 8 - 1 && bot.direction.y > 0) {
                    bot.direction.y = 0;
                    bot.direction.x = randomOneOrMinusOne();
                    bot.pos.y = 7;
                } else if (bot.pos.y <= 0 && bot.direction.y < 0) {
                    bot.direction.y = 0;
                    bot.direction.x = randomOneOrMinusOne();
                    bot.pos.y = 0;
                }
            });
            return { bots };
        }),

    start: () => {
        const intervalIds: number[] = [];
        const state = get();
        const bots = [...state.bots];
        bots.forEach((bot) => {
            const id = setInterval(
                () => state.update(bot.name),
                1000 / bot.speed
            );
            intervalIds.push(id);
        });
        return intervalIds;
    },
}));
