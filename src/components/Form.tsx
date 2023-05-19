function Form() {
    return (
        <div>
            <div className="flex justify-between px-5 py-3 bg-[#5C469C] mb-5">
                <label className="font-bold text-xl font-Inter text-[#F5F5F5]">
                    Operation
                </label>
                <select className="w-[166px] h-[28px] font-Inter cursor-pointer rounded">
                    <option selected disabled>
                        Select
                    </option>
                    <option>AND</option>
                    <option>OR</option>
                    <option>XOR</option>
                    <option>NOR</option>
                </select>
            </div>
            <div className="flex flex-col items-center justify-evenly w-[345px] h-[340px] bg-[#5C469C]">
                <form className="w-[320px] h-[246px] font-Inter bg-[#D4ADFC] p-6 rounded-lg">
                    <div className="flex justify-between">
                        <label className="text-xl font-bold">Name</label>
                        <input
                            placeholder="Enter Bot Name"
                            className="w-36 h-8 pl-1.5 font-Inter rounded"
                            type="text"
                        ></input>
                    </div>
                    <div className="flex justify-between mt-2.5">
                        <label className="text-xl font-bold">Bool Value</label>
                        <select className="w-36 h-8 cursor-pointer rounded">
                            <option disabled selected>
                                Select
                            </option>
                            <option value={0}>0</option>
                            <option value={1}>1</option>
                        </select>
                    </div>
                    <div className="flex justify-between mt-2.5">
                        <label className="text-xl font-bold">Colour</label>
                        <select className="w-36 h-8 cursor-pointer rounded">
                            <option disabled selected>
                                Select
                            </option>
                            <option value="red">Red</option>
                            <option value="blue">Blue</option>
                            <option value="green">Green</option>
                        </select>
                    </div>
                    <div className="flex justify-between mt-2.5">
                        <label className="text-xl font-bold">
                            Start Direction
                        </label>
                        <select className="w-28 h-7 cursor-pointer rounded">
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
                                type="range"
                                min={0.5}
                                max={5}
                                defaultValue={2}
                                className="slider cursor-pointer"
                            ></input>
                            <div className="flex justify-between">
                                <p className="font-Inter text-[10px]">
                                    (0.5 sec)
                                </p>
                                <p className="font-Inter text-[10px]">
                                    (5 sec)
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
                <button
                    type="button"
                    className="font-Inter w-32 h-8 bg-[#D4ADFC] rounded-lg text-xl font-bold"
                >
                    Submit
                </button>
            </div>
        </div>
    );
}

export default Form;
