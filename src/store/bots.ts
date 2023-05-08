import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Bot, Operation, Vector } from "../lib/types";

interface BotsState {
    bots: Bot[];
    createNew: (bot: Bot) => void;
    // setPosition: (botName: string, newPos: Vector) => void;
    update: (botName: string) => void;
    start: () => number[];
}

export const useBotsStore = create<BotsState>()((set) => ({
    bots: [
        {
            name: "A",
            boolValue: 0,
            operation: Operation.AND,
            pos: { x: 3, y: 7 },
            speed: 2,
            direction: "up",
            color: "blue",
        },
        {
            name: "B",
            boolValue: 1,
            operation: Operation.OR,
            pos: { x: 0, y: 2 },
            speed: 4,
            direction: "down",
            color: "green",
        },
        {
            name: "C",
            boolValue: 0,
            operation: Operation.NOT,
            pos: { x: 3, y: 2 },
            speed: 1,
            direction: "right",
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
                // TODO: Use a velocity vector instead of switching direction
                // TODO: Prevent bots from spinning in circles on the border
                switch (bot.direction) {
                    case "up":
                        if (bot.pos.y <= 0) {
                            bot.direction =
                                Math.random() > 0.5 ? "left" : "right";
                        } else {
                            bot.pos.y -= 1;
                        }
                        break;
                    case "right":
                        if (bot.pos.x >= 7) {
                            bot.direction = Math.random() > 0.5 ? "up" : "down";
                        } else {
                            bot.pos.x += 1;
                        }
                        break;
                    case "down":
                        if (bot.pos.y >= 7) {
                            bot.direction =
                                Math.random() > 0.5 ? "left" : "right";
                        } else {
                            bot.pos.y += 1;
                        }
                        break;
                    case "left":
                        if (bot.pos.x <= 0) {
                            bot.direction = Math.random() > 0.5 ? "up" : "down";
                        } else {
                            bot.pos.x -= 1;
                        }
                        break;
                }
            });
            return { bots };
        }),

    start: () => {
        const intervalIds: number[] = [];
        set((state) => {
            const bots = [...state.bots];
            bots.forEach((bot) => {
                const id = setInterval(
                    () => state.update(bot.name),
                    1000 / bot.speed
                );
                intervalIds.push(id);
            });
            return {};
        });
        return intervalIds;
    },
}));
