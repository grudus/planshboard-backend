import { combineReducers } from "redux";
import { TypedUseSelectorHook, useSelector as useReduxSelector } from "react-redux";
import { localeReducer } from "app/locale/__store/localeStore";
import { authReducer } from "app/auth/__store/authStore";
import { connectRouter } from "connected-react-router";
import { userReducer } from "app/user/__store/userReducer";
import { boardGamesReducer } from "app/board-games/__store/boardGameReducer";

const rootReducer = (history: any) =>
    combineReducers({
        locale: localeReducer,
        auth: authReducer,
        user: userReducer,
        boardGames: boardGamesReducer,
        router: connectRouter(history),
    });

export default rootReducer;
export const testTypeRootReducer = rootReducer({});

export type Store = ReturnType<typeof testTypeRootReducer>;
export const useRedux: TypedUseSelectorHook<Store> = useReduxSelector;
