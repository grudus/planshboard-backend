import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import logger from "redux-logger";
import createSagaMiddleware from "redux-saga";
import rootReducer from "./rootReducer";
import rootSaga from "../sagas/rootSaga";
import { getPersistedState, persistState } from "./persistStore";

const devMode = process.env.NODE_ENV === "development";

const sagaMiddleware = createSagaMiddleware();

const commonMiddleware = [...getDefaultMiddleware({ thunk: false, serializableCheck: false }), sagaMiddleware];

export const planshboardStore = configureStore({
    reducer: rootReducer,
    devTools: devMode,
    middleware: devMode ? [...commonMiddleware, logger] : commonMiddleware,
    preloadedState: getPersistedState(),
});

planshboardStore.subscribe(persistState(planshboardStore.getState));
sagaMiddleware.run(rootSaga);
