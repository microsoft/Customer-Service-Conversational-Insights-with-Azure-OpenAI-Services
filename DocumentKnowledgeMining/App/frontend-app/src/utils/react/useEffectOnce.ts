import { useEffect, useRef, useState } from "react";

/**
 * Custom hook that can be used instead of useEffect() with zero dependencies.
 *
 * React 18 introduced a huge breaking change, when in Strict Mode, all components mount and unmount,
 * then mount again. The reason for this is for paving the way for a feature that isn't in React yet.
 *
 * For React Hooks in React 18, this means a useEffect() with zero dependencies will be executed twice!
 *
 * Here is a custom hook that can be used instead of useEffect(), with zero dependencies,
 * that will give the old (pre React 18) behavior back, i.e. it works around the breaking change.
 *
 * // Instead of this:
 * useEffect( ()=> {
 *     
 *     return () => 
 * }, []);
 *
 * // Do this:
 * useEffectOnce( ()=> {
 *     
 *     return () => 
 * });
 *
 * Read more here:
 * https://dev.to/ag-grid/react-18-avoiding-use-effect-getting-called-twice-4i9e
 * https://kentcdodds.com/blog/react-strict-mode
 *
 * @param {function} effect The effect to run.
 * @returns {function} The destroy function.
 */
export const useEffectOnce = (effect: () => void | (() => void)) => {
    const destroyFunc = useRef<void | (() => void)>();
    const effectCalled = useRef(false);
    const renderAfterCalled = useRef(false);
    const [, setVal] = useState<number>(0);

    if (effectCalled.current) {
        renderAfterCalled.current = true;
    }

    useEffect(() => {
        // only execute the effect first time around
        if (!effectCalled.current) {
            destroyFunc.current = effect();
            effectCalled.current = true;
        }

        // this forces one render after the effect is run
        setVal((val) => val + 1);

        return () => {
            // if the comp didn't render since the useEffect was called,
            // we know it's the dummy React cycle
            if (!renderAfterCalled.current) {
                return;
            }
            if (destroyFunc.current) {
                destroyFunc.current();
            }
        };
    }, []);
};
