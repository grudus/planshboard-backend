import { Store } from "store/rootReducer";

export const mock = <T extends {}, K extends keyof T>(object: T, property: K, value: T[K]) => {
    Object.defineProperty(object, property, { get: () => value });
};

export const emptyTestState: Store = {
    auth: expect.anything(),
    router: expect.anything(),
    locale: expect.anything(),
    user: expect.anything(),
    boardGames: expect.anything(),
};
