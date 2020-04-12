import { createAction } from "@reduxjs/toolkit";
import { WaitPayload } from "app/shared/store/useAwaitDispatch";

export interface TryToLoginPayload {
    username: string;
    password: string;
}

export interface WaitTryToLoginPayload extends TryToLoginPayload, WaitPayload {}

export const tryToLoginAction = createAction<WaitTryToLoginPayload>("TRY_TO_LOGIN");
export const loginSuccessAction = createAction<Response>("LOGIN_SUCCESS");
export const authTokenObtainedAction = createAction<string>("AUTH_TOKEN_OBTAINED");
export const logoutAction = createAction("AUTH_LOGOUT");
