import { useState } from "react";
import { Operation } from "../lib/types";
import { useBotsStore } from "../store/bots";

function Form() {
    const createNew = useBotsStore((state) => state.createNew);
    const changeOperation = useBotsStore((state) => state.changeOperation);
    const operation = useBotsStore((state) => state.operation);
    const running = useBotsStore((state) => state.running);

    const [name, setName] = useState("");
    const [boolval, setBoolVal] = useState(0);
    const [color, setColor] = useState("");
    const [startDirection, setStartDirection] = useState({
        x: 0,
        y: 0,
    });
    const [speed, setSpeed] = useState(2);

    console.log(name, boolval, color, startDirection, speed);

    function handleDirection(e: string) {
        if (e === "north") {
            setStartDirection({
                x: 0,
                y: 1,
            });
        } else if (e === "east") {
            setStartDirection({
                x: -1,
                y: 0,
            });
        } else if (e === "west") {
            setStartDirection({
                x: 1,
                y: 0,
            });
        } else if (e === "south") {
            setStartDirection({
                x: 0,
                y: -1,
            });
        }
    }

    function handleOperation(e: Operation) {
        changeOperation(e);
    }

    function createNewBot() {
        createNew({
            name: name,
            boolValue: boolval as 0 | 1,
            dead: false,
            direction: startDirection,
            pos: {
                x: Math.floor(Math.random() * 8),
                y: Math.floor(Math.random() * 8),
            },
            speed: speed,
            color: color,
        });

        setName("");
        setBoolVal(0);
        setColor("");
        setStartDirection({
            x: 0,
            y: 0,
        });
        setSpeed(2);
    }

    return (
        <div>
            <div className="flex justify-between px-5 py-3 bg-[#5C469C] mb-5">
                <label className="font-bold text-xl font-Inter text-[#F5F5F5]">
                    Operation
                </label>
                <select
                    onChange={(e) =>
                        handleOperation(e.target.value as Operation)
                    }
                    defaultValue={operation}
                    disabled={running}
                    className="w-[166px] h-[28px] font-Inter cursor-pointer rounded disabled:opacity-50"
                >
                    <option disabled>Select</option>
                    <option value="and">AND</option>
                    <option value="or">OR</option>
                    <option value="xor">XOR</option>
                    <option value="nor">NOR</option>
                </select>
            </div>
            <div className="flex flex-col items-center justify-evenly w-[345px] h-[340px] bg-[#5C469C]">
                <form className="w-[320px] h-[246px] font-Inter bg-[#D4ADFC] p-6 rounded-lg">
                    <div className="flex justify-between">
                        <label className="text-xl font-bold">Name</label>
                        <input
                            value={name}
                            placeholder="Enter Bot Name"
                            className="w-36 h-8 pl-1.5 font-Inter rounded"
                            type="text"
                            onChange={(e) => setName(e.target.value)}
                        ></input>
                    </div>
                    <div className="flex justify-between mt-2.5">
                        <label className="text-xl font-bold">Bool Value</label>
                        <select
                            value={boolval}
                            onChange={(e) =>
                                setBoolVal(parseInt(e.target.value, 10))
                            }
                            className="w-36 h-8 cursor-pointer rounded"
                        >
                            <option disabled selected>
                                Select
                            </option>
                            <option>0</option>
                            <option>1</option>
                        </select>
                    </div>
                    <div className="flex justify-between mt-2.5">
                        <label className="text-xl font-bold">Colour</label>
                        <select
                            onChange={(e) => setColor(e.target.value)}
                            className="w-36 h-8 cursor-pointer rounded"
                        >
                            <option disabled selected>
                                Select
                            </option>
                            <option value="red">Red</option>
                            <option value="blue">Blue</option>
                            <option value="green">Green</option>
                            <option value="white">White</option>
                            <option value="black">Black</option>
                            <option value="purple">Purple</option>
                        </select>
                    </div>
                    <div className="flex justify-between mt-2.5">
                        <label className="text-xl font-bold">
                            Start Direction
                        </label>
                        <select
                            onChange={(e) => handleDirection(e.target.value)}
                            className="w-28 h-7 cursor-pointer rounded"
                        >
                            <option disabled selected>
                                Select
                            </option>
                            <option value="north">North</option>
                            <option value="east">East</option>
                            <option value="west">West</option>
                            <option value="south">South</option>
                        </select>
                    </div>
                    <div className="flex items-center justify-between mt-2.5">
                        <label className="text-xl font-bold">Speed</label>
                        <div className="flex flex-col">
                            <input
                                value={speed}
                                type="range"
                                min="0.5"
                                max="5"
                                step="0.1"
                                onChange={(e) =>
                                    setSpeed(parseFloat(e.target.value))
                                }
                                className="slider cursor-pointer"
                            ></input>
                            <div className="mt-[8px] flex justify-between">
                                <p className="font-Inter text-[14px]">
                                    (0.5 sec)
                                </p>
                                <p className="font-Inter text-[14px]">
                                    (5 sec)
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
                <button
                    onClick={createNewBot}
                    type="button"
                    className="font-Inter w-32 h-8 bg-[#D4ADFC] rounded-md text-xl font-bold"
                >
                    Submit
                </button>
            </div>
        </div>
    );
}

export default Form;
