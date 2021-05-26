import { createReducer, PayloadAction } from "@reduxjs/toolkit";
import AuthActions from "app/auth/__store/authActions";

export interface AuthStore {
    token?: string;
}

const initialState: AuthStore = {};

export const authReducer = createReducer(initialState, {
    [AuthActions.authTokenObtained.type]: (state, action: PayloadAction<string>) => ({
        ...state,
        token: action.payload,
    }),
});
