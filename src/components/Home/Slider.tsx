import { Dispatch, SetStateAction, useState } from "react"

export default function Slider({
    value,
    max,
    setValue,
    enableMax = false,
}: {
    value: number | string,
    max: number,
    setValue: CallableFunction
    enableMax?: boolean
}) {
    const [focused, setFocused] = useState(false);
    const [sliding, setSliding] = useState(false);

    return (
        <>
            <div onBlur={() => setFocused(false)}>
                <div className="w-full relative">
                    <input
                        id="medium-range"
                        type="range"
                        className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700`}
                        value={Math.min(Number(value ?? '0'), max ?? 100)}
                        max={max ? max : 100}
                        min={-0}
                        step={max ? max / 100 : .0001}
                        onChange={(e) => { setValue(Number(e.target.value)); setSliding(true)}}
                        onFocus={() => setSliding(true)}
                        onBlur={() => setSliding(false)}
                    />
                </div>
                <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full p-1 bg-background rounded-md theme-border outline-none"
                    onFocus={() => { setFocused(true); setSliding(false) }}
                    step={0.001}
                />
            </div>
        </>
    )
}
