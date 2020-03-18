import { createReducer, PayloadAction } from "@reduxjs/toolkit";
import { authTokenObtainedAction } from "app/auth/store/authActions";

export interface AuthStore {
    token?: string;
}

const initialState: AuthStore = {};

export const authReducer = createReducer(initialState, {
    [authTokenObtainedAction.type]: (state, action: PayloadAction<string>) => ({
        ...state,
        token: action.payload,
    }),
});
