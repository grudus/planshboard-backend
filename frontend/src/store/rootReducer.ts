import { combineReducers } from "redux";
import { TypedUseSelectorHook, useSelector as useReduxSelector } from "react-redux";
import { localeReducer } from "app/locale/store/localeStore";
import { authReducer } from "app/auth/store/authStore";

const rootReducer = combineReducers({
    locale: localeReducer,
    auth: authReducer,
});

export default rootReducer;

export type Store = ReturnType<typeof rootReducer>;
export const useRedux: TypedUseSelectorHook<Store> = useReduxSelector;
