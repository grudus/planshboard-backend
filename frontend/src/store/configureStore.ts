import { configureStore, getDefaultMiddleware, PayloadAction } from "@reduxjs/toolkit";
import logger from "redux-logger";
import createSagaMiddleware from "redux-saga";
import rootReducer from "./rootReducer";
import rootSaga from "../sagas/rootSaga";
import { getPersistedState, persistState } from "./persistStore";
import { createBrowserHistory, History, LocationState } from "history";
import { routerMiddleware } from "connected-react-router";
import { logoutAction } from "app/auth/__store/authActions";

const devMode = process.env.NODE_ENV === "development";

export const history: History<LocationState> = createBrowserHistory();

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
    let newState: any = state;
    if (action.type === logoutAction.type) {
        newState = {
            router: state.router,
            locale: state.locale,
        };
    }
    return rootReducer(history)(newState, action);
};

export const planshboardStore = configureStore({
    reducer: logoutAwareReducer,
    devTools: devMode,
    middleware: devMode ? [...commonMiddleware, logger] : commonMiddleware,
    preloadedState: getPersistedState(),
});

planshboardStore.subscribe(persistState(planshboardStore.getState));
sagaMiddleware.run(rootSaga);
