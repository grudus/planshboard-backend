import { put, take, takeLatest } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { loginSuccessAction, tryToLoginAction, WaitTryToLoginPayload } from "app/auth/store/authActions";
import { httpRequestAction, httpSuccessAction } from "app/shared/store/httpRequestActions";

function extractAuthToken(successResponse: any): string {
    return successResponse.payload.headers.get("Authorization");
}

function* login(action: PayloadAction<WaitTryToLoginPayload>): Generator {
    const { resolve, reject, ...body } = action.payload;

    yield put(
        httpRequestAction({
            resolve: resolve,
            reject,
            type: "post",
            isForm: true,
            body,
            path: "api/auth/login",
        }),
    );
    const successResponse = yield take(httpSuccessAction.type);
    const token = extractAuthToken(successResponse);
    yield put(loginSuccessAction({ token }));
    resolve?.();
}

export default function* loginSaga(): Generator {
    yield takeLatest(tryToLoginAction.type, login);
}
