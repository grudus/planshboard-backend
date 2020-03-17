import { createReducer, PayloadAction } from "@reduxjs/toolkit";
import { loginSuccessAction, LoginSuccessPayload } from "app/auth/store/authActions";

export interface AuthStore {
    token?: string;
}

const initialState: AuthStore = {};

export const authReducer = createReducer(initialState, {
    [loginSuccessAction.type]: (state, action: PayloadAction<LoginSuccessPayload>) => ({
        ...state,
        token: action.payload.token,
    }),
});
