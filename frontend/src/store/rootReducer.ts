import { combineReducers } from "redux";
import { TypedUseSelectorHook, useSelector as useReduxSelector } from "react-redux";
import { localeReducer } from "app/locale/__store/localeStore";
import { authReducer } from "app/auth/__store/authStore";
import { connectRouter } from "connected-react-router";
import { userReducer } from "app/user/__store/userReducer";
import { boardGamesReducer } from "app/board-games/__store/boardGameReducer";
import { opponentReducer } from "app/opponents/__store/opponentReducer";
import { History, LocationState } from "history";
import { playReducer } from "app/plays/__store/playReducer";

const rootReducer = (history: History<LocationState>) =>
    combineReducers({
        locale: localeReducer,
        auth: authReducer,
        user: userReducer,
        boardGame: boardGamesReducer,
        opponent: opponentReducer,
        play: playReducer,
        router: connectRouter(history),
    });

export default rootReducer;
// @ts-ignore tet only
export const testTypeRootReducer = rootReducer({});

export type Store = ReturnType<typeof testTypeRootReducer>;
export const useRedux: TypedUseSelectorHook<Store> = useReduxSelector;
