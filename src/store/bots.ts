import { create } from "zustand";
import { Bot, Bots, Operation, Vector } from "../lib/types";

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

const generateUniqueNames = (n: number): string[] => {
    const charPool = "abcdefghijklmnopqrstuvwxyz"; // max combinations is 325
    const availableNames: string[] = [];
    let count = 0;
    for (let i = 0; i < charPool.length; i++) {
        for (let j = i + 1; j < charPool.length; j++) {
            count++;
            const name = charPool.slice(i, j);
            // console.log(name);
            availableNames.push(name);
            if (count > n) {
                return availableNames;
            }
        }
    }
    return availableNames;
};

const generateBots = (n: number): Bots => {
    const bots: Bots = {};
    // Generating unique names
    let availableNames = generateUniqueNames(n);

    if (n > availableNames.length) {
        throw new Error(
            `Number of generated names is ${availableNames.length} in the generateBots method. Cannot exceed that limit`
        );
    }
    for (let i = 0; i < n; i++) {
        // generating names
        const uniqueName = availableNames[i];
        // availableNames = availableNames.filter((name) => name !== uniqueName); // Just removing the name from the arr

        // generating direction
        const x = randomChoice([-1, 0, 1]);
        const y = x === 0 ? randomChoice([-1, 1]) : 0;
        const bot: Bot = {
            name: uniqueName,
            boolValue: randomChoice([0, 1]),
            dead: false,
            direction: {
                x: x,
                y: y,
            },
            pos: randomVector(0, 0, 8, 8),
            speed: 1 + Math.floor(Math.random() * 8),
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
        };
        if (uniqueName in bots) {
            throw new Error(`${uniqueName} name already exists`);
        }

        bots[uniqueName] = bot;
        // console.log(uniqueName, i);
    }
    return bots;
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
    bots: Bots;
    running: boolean;
    timeScale: number;
    createNew: (bot: Bot) => void;
    kill: (botName: string) => void;
    update: (botName: string) => void;
    start: () => void;
    stop: () => void;
    nextStep: () => void;
    pauseFor: (botName: string, ms: number) => void;
    setTimeScale: (timeScale: number) => void;
    setTimeScaleWhileRunning: (timeScale: number) => void;
}

export const useBotsStore = create<BotsState>()((set, get) => ({
    operation: Operation.OR,
    bots: generateBots(64),
    running: false,
    timeScale: 1,

    createNew: (bot) =>
        set((state) => {
            const bots = { ...state.bots };
            bots[bot.name] = bot;
            return { bots };
        }),

    kill: (botName) =>
        set((state) => {
            const bots = { ...state.bots };
            const bot = bots[botName];
            bot.dead = true;
            if (bot.intervalId) clearInterval(bot.intervalId);
            bot.intervalId = null;
            return { bots: bots };
        }),

    update: (botName) =>
        set((state) => {
            const bots = { ...state.bots };
            const bot = bots[botName];
            if (bot.dead) return {};
            // if (!bot.intervalId) return {};
            // Prevent bots from spinning in circles on the border
            // generating random direction based on probability of 0.75
            if (Math.random() < 0.75) {
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
            Object.keys(bots).forEach((obot_key) => {
                const obot = bots[obot_key];
                if (bot === obot) return; // avoid self collision
                if (obot.dead) return;

                // checking if the updated position overlaps with an already existing bot
                if (bot.pos.x === obot.pos.x && bot.pos.y === obot.pos.y) {
                    // --- Collision ---
                    // Check WIN or LOSE
                    const determiningBot = bot.speed > obot.speed ? bot : obot; // bot with greater speed will be the winning bot in case of 1
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
                            result = !(bot.boolValue || obot.boolValue) ? 1 : 0;
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
                    if (
                        result === 1 &&
                        determiningBot.intervalId && // not paused
                        nonDeterminingBot.intervalId && // not paused
                        determiningBot.name !== nonDeterminingBot.name // both can be equal if both have same speed. assume tie in that case
                    ) {
                        console.log(
                            `${determiningBot.name} ${determiningBot.color} - killed - ${nonDeterminingBot.name} ${nonDeterminingBot.color}`
                        );
                        if (determiningBot.name === nonDeterminingBot.name) {
                            throw new Error("Why does this happen");
                        }
                        state.pauseFor(
                            determiningBot.name,
                            1000 * state.timeScale
                        );
                        state.kill(nonDeterminingBot.name);
                    } else {
                        // console.log("TIE");
                    }
                }
            });

            return { bots };
        }),

    start: () =>
        set((state) => {
            const bots = { ...state.bots };
            Object.values(bots).forEach((bot) => {
                if (bot.dead) return;
                const id = setInterval(
                    () => state.update(bot.name),
                    (state.timeScale * 1000) / bot.speed
                );
                bot.intervalId = id;
            });
            return { bots, running: true };
        }),

    stop: () =>
        set((state) => {
            const bots = { ...state.bots };
            Object.values(bots).forEach((bot) => {
                if (bot.dead) return;
                if (bot.intervalId) clearInterval(bot.intervalId);
                if (bot.timeoutId) clearTimeout(bot.timeoutId);
                bot.intervalId = null;
                bot.timeoutId = null;
            });
            return { bots, running: false };
        }),

    nextStep: () => {
        set((state) => {
            const bots = { ...state.bots };
            if (state.running) return {};
            state.start();
            let greatestInterval = 0;
            Object.values(bots).forEach((bot) => {
                if (bot.dead) return;
                const interval = (state.timeScale * 1000) / bot.speed;
                if (greatestInterval < interval) {
                    greatestInterval = interval;
                }
                bot.timeoutId = setTimeout(() => {
                    if (bot.intervalId) clearInterval(bot.intervalId);
                    if (bot.timeoutId) clearTimeout(bot.timeoutId);
                    bot.intervalId = null;
                    bot.timeoutId = null;
                }, interval);
            });

            setTimeout(state.stop, greatestInterval);

            return { bots };
        });
    },

    pauseFor: (botName, ms) => {
        set((state) => {
            const bots = { ...state.bots };
            const bot = bots[botName];
            if (bot.intervalId && !bot.dead && state.running) {
                clearInterval(bot.intervalId);
                bot.intervalId = null;
                // console.log("Pausing: ", bot.name, bot.color);
                bot.timeoutId = setTimeout(() => {
                    // console.log("Playing: ", bot.name, bot.color);
                    bot.intervalId = setInterval(
                        () => state.update(botName),
                        (state.timeScale * 1000) / bot.speed
                    );
                }, ms);
                return { bots };
            }
            return {};
        });
    },

    setTimeScale: (timeScale) => {
        set((state) => {
            if (state.running) {
                throw new Error(
                    "Cant change timestep while running. Pause it first."
                );
            }
            // if (state.running) {
            //     state.stop();
            //     state.start();
            // }
            return { timeScale };
        });
    },

    setTimeScaleWhileRunning: (timeScale) => {
        const state = get();
        if (state.running) {
            state.stop();
            state.setTimeScale(timeScale);
            state.start();
        } else {
            state.setTimeScale(timeScale);
        }
    },
}));
