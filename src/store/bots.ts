import { create } from "zustand";
import { Bot, Operation, Vector } from "../lib/types";

const randomChoice = (arr: any[]) => {
    return arr[Math.floor(Math.random() * arr.length)];
};

const randomVector = (
    minX: number,
    minY: number,
    maxX: number,
    maxY: number
): Vector => {
    return {
        x: minX + Math.floor(Math.random() * (minX + maxX)),
        y: minY + Math.floor(Math.random() * (minY + maxY)),
    };
};

const generateBots = (n: number): Bot[] => {
    const res: Bot[] = [];
    if (n > 64) {
        throw new Error("Not enough names in the generateBots method");
    }
    let availableNames = [
        ..."abcdefghijklmnopqrstuvwxyz1234567890_ !@#$%^&*()-+=[]{}|';:<>,.?/", // just 65 random characters to cap max number of bots
    ];
    for (let i = 0; i < n; i++) {
        // generating names
        const uniqueName = randomChoice(availableNames);
        availableNames = availableNames.filter((name) => name !== uniqueName); // Just removing the name from the arr

        // generating direction
        const x = randomChoice([-1, 0, 1]);
        const y = x === 0 ? randomChoice([-1, 1]) : 0;
        res.push({
            name: uniqueName,
            boolValue: randomChoice([0, 1]),
            dead: false,
            direction: {
                x: x,
                y: y,
            },
            pos: randomVector(0, 0, 8, 8),
            speed: 1 + Math.floor(Math.random() * 6),
            color: randomChoice([
                "red",
                "green",
                "white",
                "blue",
                "lightblue",
                "purple",
                "black",
                "pink",
            ]),
            intervalId: null,
        });
    }
    return res;
};

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
    // intervalIds: number[];
    running: boolean;
    createNew: (bot: Bot) => void;
    kill: (botName: string) => void;
    update: (botName: string) => void;
    start: () => void;
    stop: () => void;
    nextStep: () => void;
    pauseFor: (botName: string, ms: number) => void;
}

export const useBotsStore = create<BotsState>()((set, get) => ({
    operation: Operation.XOR,
    bots: generateBots(32),
    running: false,
    // intervalIds: [],

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
                if (botName !== bot.name) return;
                if (bot.dead) return;
                // Prevent bots from spinning in circles on the border
                // generating random direction based on probability of 0.5
                if (Math.random() < 0.5) {
                    bot.direction.x = randomChoice([-1, 0, 1]);
                    bot.direction.y =
                        bot.direction.x === 0 ? randomChoice([-1, 1]) : 0;
                }
                // bot.direction.x = randomChoice([-1, 0, 1])
                // Move first
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
                            // console.log(
                            //     determiningBot.name,
                            //     determiningBot.color
                            // );
                            get().kill(nonDeterminingBot.name);
                            get().pauseFor(determiningBot.name, 500);
                            // determiningBot.pos.x -= determiningBot.direction.x;
                            // determiningBot.pos.y -= determiningBot.direction.y;
                        } else {
                            // console.log("TIE");
                        }
                    }
                });
            });
            return { bots };
        }),

    start: () =>
        set((state) => {
            const bots = [...state.bots];
            bots.forEach((bot) => {
                const id = setInterval(
                    () => state.update(bot.name),
                    1000 / bot.speed
                );
                bot.intervalId = id;
            });
            return { bots, running: true };
        }),

    stop: () =>
        set((state) => {
            const bots = [...state.bots];
            bots.forEach((bot) => {
                if (bot.intervalId) clearInterval(bot.intervalId);
            });
            return { bots, running: false };
        }),

    nextStep: () => {
        console.warn(`
        IMP: The nextStep function is only for debug purposes. 
        It doesnt take into account the speed of the bots to move them. 
        `);

        const state = get();
        const bots = [...state.bots];
        bots.forEach((bot) => {
            state.update(bot.name);
        });
    },

    pauseFor: (botName, ms) => {
        set((state) => {
            const bots = [...state.bots];
            bots.forEach((bot) => {
                if (bot.name !== botName || !bot.intervalId) return;
                console.log(bot.intervalId);
                clearInterval(bot.intervalId);
                bot.intervalId = null;
                // FIXME: RISK of not clearing this timeout
                setTimeout(() => {
                    console.log("HELLOW");
                    bot.intervalId = setInterval(
                        () => state.update(botName),
                        1000 / bot.speed
                    );
                }, ms);
            });
            return { bots };
        });
    },
}));
