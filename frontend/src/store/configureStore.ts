import { configureStore, getDefaultMiddleware, PayloadAction } from "@reduxjs/toolkit";
import logger from "redux-logger";
import createSagaMiddleware from "redux-saga";
import rootReducer from "./rootReducer";
import rootSaga from "../sagas/rootSaga";
import { getPersistedState, persistState } from "./persistStore";
import { createBrowserHistory } from "history";
import { routerMiddleware } from "connected-react-router";
import { logoutAction } from "app/auth/store/authActions";

const devMode = process.env.NODE_ENV === "development";

export const history = createBrowserHistory();

const sagaMiddleware = createSagaMiddleware();

const commonMiddleware = [
    ...getDefaultMiddleware({
        thunk: false,
        serializableCheck: false,
    }),
    sagaMiddleware,
    routerMiddleware(history),
];

const logoutAwareReducer = (state: any, action: PayloadAction) => {
    if (action.type === logoutAction.type) state = undefined;
    return rootReducer(history)(state, action);
};

export const planshboardStore = configureStore({
    reducer: logoutAwareReducer,
    devTools: devMode,
    middleware: devMode ? [...commonMiddleware, logger] : commonMiddleware,
    preloadedState: getPersistedState(),
});

planshboardStore.subscribe(persistState(planshboardStore.getState));
sagaMiddleware.run(rootSaga);
