import { combineReducers } from "redux";
import { TypedUseSelectorHook, useSelector as useReduxSelector } from "react-redux";
import { localeReducer } from "app/locale/store/localeStore";
import { authReducer } from "app/auth/store/authStore";
import { connectRouter } from "connected-react-router";
import { userReducer } from "app/user/store/userReducer";

const rootReducer = (history: any) =>
    combineReducers({
        locale: localeReducer,
        auth: authReducer,
        user: userReducer,
        router: connectRouter(history),
    });

export default rootReducer;
export const testTypeRootReducer = rootReducer({});

export type Store = ReturnType<typeof testTypeRootReducer>;
export const useRedux: TypedUseSelectorHook<Store> = useReduxSelector;
