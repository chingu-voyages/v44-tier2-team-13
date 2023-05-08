import { create } from "zustand";
import { Bot, Operation } from "../lib/types";

const defaultBots: Bot[] = [
    {
        name: "A",
        boolValue: 0,
        pos: { x: 3, y: 7 },
        speed: 2,
        dead: false,
        direction: { x: 0, y: -1 }, // up
        color: "blue",
    },
    {
        name: "B",
        boolValue: 1,
        pos: { x: 0, y: 2 },
        speed: 4,
        dead: false,
        direction: { x: 0, y: 1 }, // down
        color: "green",
    },
    {
        name: "C",
        boolValue: 0,
        pos: { x: 3, y: 2 },
        speed: 1,
        dead: false,
        direction: { x: 1, y: 0 }, // right
        color: "red",
    },
    {
        name: "D",
        boolValue: 1,
        pos: { x: 4, y: 6 },
        speed: 3,
        dead: false,
        direction: { x: 1, y: 0 }, // right
        color: "yellow",
    },
    {
        name: "E",
        boolValue: 1,
        pos: { x: 5, y: 5 },
        speed: 2,
        dead: false,
        direction: { x: 1, y: 0 }, // right
        color: "pink",
    },
    {
        name: "F",
        boolValue: 0,
        pos: { x: 3, y: 0 },
        speed: 5,
        dead: false,
        direction: { x: 1, y: 0 }, // right
        color: "purple",
    },
];

const randomOneOrMinusOne = () => {
    if (Math.random() > 0.5) {
        return -1;
    } else {
        return 1;
    }
};

interface BotsState {
    operation: Operation;
    bots: Bot[];
    intervalIds: number[];
    running: boolean;
    createNew: (bot: Bot) => void;
    kill: (botName: string) => void;
    update: (botName: string) => void;
    start: () => void;
    stop: () => void;
}

export const useBotsStore = create<BotsState>()((set, get) => ({
    operation: Operation.OR,
    bots: defaultBots,
    running: false,
    intervalIds: [],

    createNew: (bot) =>
        set((state) => {
            return { bots: [...state.bots, bot] };
        }),

    kill: (botName) =>
        set((state) => {
            const bots = [...state.bots];
            bots.forEach((bot) => {
                if (bot.name === botName) {
                    bot.dead = true;
                }
            });
            return { bots: bots };
        }),

    update: (botName) =>
        set((state) => {
            const bots = [...state.bots];
            bots.forEach((bot) => {
                if (bot.dead) return;
                // Move first
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

                // Check for collisions
                bots.forEach((obot) => {
                    if (bot === obot) return; // avoid self collision
                    if (obot.dead) return;

                    // checking if the updated position overlaps with an already existing bot
                    if (bot.pos.x === obot.pos.x && bot.pos.y === obot.pos.y) {
                        // --- Collision ---
                        // Check WIN or LOSE
                        const determiningBot =
                            bot.speed > obot.speed ? bot : obot; // bot with greater speed will be the winning bot in case of 1
                        const nonDeterminingBot =
                            bot.speed < obot.speed ? bot : obot; // bot with lesser speed will be the losing bot in case of 1

                        let result: 0 | 1;
                        switch (state.operation) {
                            case Operation.AND:
                                result = bot.boolValue && obot.boolValue;
                                break;
                            case Operation.OR:
                                result = bot.boolValue || obot.boolValue;
                                break;
                            case Operation.NOR:
                                result = !(bot.boolValue || obot.boolValue)
                                    ? 1
                                    : 0;
                                break;
                            case Operation.XOR:
                                // Copied off of the internet
                                result =
                                    (bot.boolValue || obot.boolValue) &&
                                    !(bot.boolValue && obot.boolValue)
                                        ? 1
                                        : 0;
                                break;
                        }

                        // Removing the loser
                        if (result === 1) {
                            console.log(
                                determiningBot.name,
                                determiningBot.color
                            );
                            get().kill(nonDeterminingBot.name);
                            determiningBot.pos.x -= determiningBot.direction.x;
                            determiningBot.pos.y -= determiningBot.direction.y;
                        } else {
                            console.log("TIE");
                        }
                    }
                });
            });
            return { bots };
        }),

    start: () =>
        set((state) => {
            const intervalIds: number[] = [];
            const bots = [...state.bots];
            bots.forEach((bot) => {
                const id = setInterval(
                    () => state.update(bot.name),
                    1000 / bot.speed
                );
                intervalIds.push(id);
            });
            return { intervalIds, running: true };
        }),

    stop: () =>
        set((state) => {
            state.intervalIds.forEach((id) => {
                clearInterval(id);
            });
            return { intervalIds: [], running: false };
        }),
}));
