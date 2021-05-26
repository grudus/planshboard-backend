import { createAction } from "@reduxjs/toolkit";
import { WaitPayload } from "app/shared/store/useAwaitDispatch";
import { baseHttpAction } from "app/shared/store/httpRequestActions";
import AuthApi from "app/auth/AuthApi";

export interface TryToLoginPayload {
    username: string;
    password: string;
}

export interface WaitTryToLoginPayload extends TryToLoginPayload, WaitPayload {}

const register = baseHttpAction("REGISTRATION", AuthApi.register);

const checkUsername = baseHttpAction("CHECK_USERNAME", AuthApi.checkUsername);

const authTokenObtained = createAction<string>("AUTH_TOKEN_OBTAINED");

const logout = createAction("AUTH_LOGOUT");

const tryToLogin = createAction<WaitTryToLoginPayload>("TRY_TO_LOGIN");

const loginSuccess = createAction("LOGIN_SUCCESS");

const AuthActions = {
    register,
    checkUsername,
    authTokenObtained,
    logout,
    tryToLogin,
    loginSuccess,
};

export default AuthActions;
