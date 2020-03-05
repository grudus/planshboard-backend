import { combineReducers } from "redux";
import { TypedUseSelectorHook, useSelector as useReduxSelector } from "react-redux";
import { localeReducer } from "../app/locale/store/localeStore";

const rootReducer = combineReducers({
    locale: localeReducer,
});

export default rootReducer;

export type Store = ReturnType<typeof rootReducer>;
export const useRedux: TypedUseSelectorHook<Store> = useReduxSelector;
