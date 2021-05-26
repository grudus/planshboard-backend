import { put, takeLatest } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import AuthActions, { WaitTryToLoginPayload } from "app/auth/__store/authActions";
import { httpRequestAction } from "app/shared/store/httpRequestActions";
import { apiRoutes } from "app/routing/routes";

function extractAuthToken(successResponse: Response): string | null {
    return successResponse.headers.get("Authorization");
}

function* login(action: PayloadAction<WaitTryToLoginPayload>): Generator {
    const { resolve, reject, ...body } = action.payload;

    yield put(
        httpRequestAction({
            resolve,
            reject,
            type: "post",
            isForm: true,
            body,
            path: apiRoutes.auth.login,
            successAction: AuthActions.loginSuccess,
        }),
    );
}

function* afterSuccessfulLogin(action: PayloadAction<Response>): Generator {
    const token = extractAuthToken(action.payload);
    if (token) yield put(AuthActions.authTokenObtained(token));
}

export default function* loginSaga(): Generator {
    yield takeLatest(AuthActions.tryToLogin.type, login);
    yield takeLatest(AuthActions.loginSuccess.type, afterSuccessfulLogin);
}
