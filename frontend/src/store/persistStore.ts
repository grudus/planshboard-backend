import throttle from "lodash/throttle";

const STATE_KEY = "reduxState";

export const persistState = (state: any): void => {
    throttle(() => doSaveInLocalStorage(state), 1000);
};

export const getPersistedState = (): any => {
    try {
        const serializedState = localStorage.getItem(STATE_KEY);
        return serializedState ? JSON.parse(serializedState) : undefined;
    } catch (e) {
        return undefined;
    }
};

const doSaveInLocalStorage = (state: any): void => {
    try {
        localStorage.setItem(STATE_KEY, JSON.stringify(state));
    } catch (e) {
        // Ignore;
    }
};
