import { createAction } from "@reduxjs/toolkit";
import { WaitPayload } from "app/shared/store/useAwaitDispatch";

export interface TryToLoginPayload {
    username: string;
    password: string;
}

export interface WaitTryToLoginPayload extends TryToLoginPayload, WaitPayload {}

export interface LoginSuccessPayload {
    token: string;
}

export const tryToLoginAction = createAction<WaitTryToLoginPayload>("TRY_TO_LOGIN");
export const loginSuccessAction = createAction<LoginSuccessPayload>("LOGIN_SUCCESS");
