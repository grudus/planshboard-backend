import { persistState } from "store/persistStore";

const AFTER_THROTTLE_WINDOW = 1200;

test("Should save in local storage after throttle time", async () => {
    const state = () => ({ state: { hello: "world" } });
    persistState(state);
    setTimeout(() => {
        expect(window.localStorage.setItem).toBeCalledWith(expect.any(String), state);
    }, AFTER_THROTTLE_WINDOW);
});

test("Should save in local storage only once in throttle window", async () => {
    const state = () => ({ state: { hello: "world" } });
    persistState(state);
    persistState(state);
    persistState(state);
    setTimeout(() => {
        expect(window.localStorage.setItem).toBeCalledTimes(1);
    }, AFTER_THROTTLE_WINDOW);
});
