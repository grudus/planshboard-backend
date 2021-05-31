import { PayloadAction } from "@reduxjs/toolkit";
import AuthActions from "app/auth/__store/authActions";
import { ActionListener } from "store/listenForActionMiddleware";
import { AppDispatch } from "store/useAppDispatch";

const extractAuthToken = (successResponse: Response): string | null => successResponse.headers.get("Authorization");

function afterSuccessfulLogin(action: PayloadAction<Response>, dispatch: AppDispatch) {
    const token = extractAuthToken(action.payload);
    if (token) dispatch(AuthActions.authTokenObtained(token));
}

export const LoginListener: ActionListener = [AuthActions.login.fulfilled.type, afterSuccessfulLogin];
