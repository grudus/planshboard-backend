import { createReducer, PayloadAction } from "@reduxjs/toolkit";
import { getCurrentUserSuccessAction, GetCurrentUserSuccessPayload } from "app/user/store/userActions";

export interface UserStore {
    current?: {
        id: number;
        username: string;
    };
}

const initialState: UserStore = {};

export const userReducer = createReducer<UserStore>(initialState, {
    [getCurrentUserSuccessAction.type]: (state, action: PayloadAction<GetCurrentUserSuccessPayload>) => ({
        ...state,
        current: action.payload,
    }),
});
