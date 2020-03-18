import { put, takeLatest } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import {
    authTokenObtainedAction,
    loginSuccessAction,
    tryToLoginAction,
    WaitTryToLoginPayload,
} from "app/auth/store/authActions";
import { httpRequestAction } from "app/shared/store/httpRequestActions";

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
            path: "api/auth/login",
            successAction: loginSuccessAction,
        }),
    );
}

function* afterSuccessfulLogin(action: PayloadAction<Response>): Generator {
    const token = extractAuthToken(action.payload);
    if (token) yield put(authTokenObtainedAction(token));
}

export default function* loginSaga(): Generator {
    yield takeLatest(tryToLoginAction.type, login);
    yield takeLatest(loginSuccessAction.type, afterSuccessfulLogin);
}
