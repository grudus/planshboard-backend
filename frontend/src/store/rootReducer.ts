import { combineReducers } from "redux";
import { TypedUseSelectorHook, useSelector as useReduxSelector } from "react-redux";
import { localeReducer } from "app/locale/store/localeStore";
import { authReducer } from "app/auth/store/authStore";
import { userReducer } from "app/user/store/userReducer";
import { connectRouter } from "connected-react-router";

const rootReducer = (history: any) =>
    combineReducers({
        locale: localeReducer,
        auth: authReducer,
        user: userReducer,
        router: connectRouter(history),
    });

export default rootReducer;
const rootType = rootReducer({});

export type Store = ReturnType<typeof rootType>;
export const useRedux: TypedUseSelectorHook<Store> = useReduxSelector;
