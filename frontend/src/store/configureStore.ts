import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import logger from "redux-logger";
import createSagaMiddleware from "redux-saga";
import rootReducer from "./rootReducer";
import rootSaga from "../sagas/rootSaga";
import { getPersistedState, persistState } from "./persistStore";
import { createBrowserHistory } from "history";
import { routerMiddleware } from "connected-react-router";

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

export const planshboardStore = configureStore({
    reducer: rootReducer(history),
    devTools: devMode,
    middleware: devMode ? [...commonMiddleware, logger] : commonMiddleware,
    preloadedState: getPersistedState(),
});

planshboardStore.subscribe(persistState(planshboardStore.getState));
sagaMiddleware.run(rootSaga);
