import * as rootReducer from "store/rootReducer";
import { Store } from "store/rootReducer";
import * as httpActions from "app/shared/store/httpRequestActions";

export const mock = <T extends {}, K extends keyof T>(object: T, property: K, value: T[K]) => {
    Object.defineProperty(object, property, { get: () => value });
};

export const mockRedux = <T>(response: any) => {
    mock(rootReducer, "useRedux", state => state(response));
};
export const mockHttpDispatch = <T>(response: any = {}) => {
    mock(httpActions, "useHttpDispatch", () => () => Promise.resolve(response));
};

export const emptyTestState: Store = {
    auth: expect.anything(),
    router: expect.anything(),
    locale: expect.anything(),
    user: expect.anything(),
    boardGames: expect.anything(),
};
