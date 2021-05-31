import { createAction } from "@reduxjs/toolkit";
import { baseHttpAction } from "app/shared/store/httpRequestActions";
import AuthApi from "app/auth/AuthApi";
import { ExistsResponse } from "app/shared/models/Response";

const register = baseHttpAction("REGISTRATION", AuthApi.register);

const checkUsername = baseHttpAction<ExistsResponse>("CHECK_USERNAME", AuthApi.checkUsername);

const authTokenObtained = createAction<string>("AUTH_TOKEN_OBTAINED");

const logout = createAction("AUTH_LOGOUT");
const login = baseHttpAction("AUTH_LOGIN", AuthApi.login);

const AuthActions = {
    register,
    checkUsername,
    authTokenObtained,
    logout,
    login,
};

export default AuthActions;
