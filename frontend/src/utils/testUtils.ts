import * as rootReducer from "store/rootReducer";
import { Store } from "store/rootReducer";
import * as dispatch from "store/useAppDispatch";

export const mock = <T extends any, K extends keyof T>(object: T, property: K, value: T[K]) => {
    Object.defineProperty(object, property, { get: () => value });
};

export const mockRedux = (response: any) => {
    const store = "locale" in response ? response : { ...response, locale: {} };
    mock(rootReducer, "useRedux", state => state(store));
};
export const mockTranslations = (translations: any = {}) => {
    mockRedux({ locale: { translations } });
};
export const mockDispatch = (response: any = {}) => {
    mock(dispatch, "useAppDispatch", () => () => Promise.resolve(response));
};

export const emptyTestState: Store = {
    auth: expect.anything(),
    router: expect.anything(),
    locale: expect.anything(),
    user: expect.anything(),
    boardGame: expect.anything(),
    opponent: expect.anything(),
    play: expect.anything(),
    notification: expect.anything(),
};
