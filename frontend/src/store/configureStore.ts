import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import logger from "redux-logger";
import createSagaMiddleware from "redux-saga";
import rootReducer from "./rootReducer";
import rootSaga from "../sagas/rootSaga";

const devMode = process.env.NODE_ENV === "development";

const sagaMiddleware = createSagaMiddleware();

const commonMiddleware = [...getDefaultMiddleware({ thunk: false }), sagaMiddleware];

export const planshboardStore = configureStore({
    reducer: rootReducer,
    devTools: devMode,
    middleware: devMode ? [...commonMiddleware, logger] : commonMiddleware,
});
sagaMiddleware.run(rootSaga);
