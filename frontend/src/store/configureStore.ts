import { configureStore, PayloadAction } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import { getPersistedState, persistState } from "./persistStore";
import { createBrowserHistory, History, LocationState } from "history";
import { routerMiddleware } from "connected-react-router";
import AuthActions from "app/auth/__store/authActions";
import logger from "redux-logger";
import { listenForActionsMiddleware } from "store/listenForActionMiddleware";
import { registeredListeners } from "action-listeners/registeredListeners";

const devMode = process.env.NODE_ENV === "development";

export const history: History<LocationState> = createBrowserHistory();

const logoutAwareReducer = (state: any, action: PayloadAction) => {
    let newState: any = state;
    if (action.type === AuthActions.logout.type) {
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
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        })
            .prepend(listenForActionsMiddleware(registeredListeners))
            .concat(logger, routerMiddleware(history)),
    preloadedState: getPersistedState(),
});

planshboardStore.subscribe(persistState(planshboardStore.getState));
