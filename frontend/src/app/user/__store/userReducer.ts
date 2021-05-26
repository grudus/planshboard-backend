import { createReducer, PayloadAction } from "@reduxjs/toolkit";
import UserActions from "app/user/__store/userActions";
import { CurrentUser } from "app/user/__models/UserModels";

export interface UserStore {
    current?: {
        id: number;
        username: string;
    };
}

const initialState: UserStore = {};

export const userReducer = createReducer<UserStore>(initialState, {
    [UserActions.getCurrentUser.fulfilled.type]: (state, action: PayloadAction<CurrentUser>) => ({
        ...state,
        current: action.payload,
    }),
});
