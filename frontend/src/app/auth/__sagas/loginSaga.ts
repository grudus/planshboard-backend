import { put, takeLatest } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import AuthActions from "app/auth/__store/authActions";

function extractAuthToken(successResponse: Response): string | null {
    return successResponse.headers.get("Authorization");
}

function* afterSuccessfulLogin(action: PayloadAction<Response>): Generator {
    const token = extractAuthToken(action.payload);
    if (token) yield put(AuthActions.authTokenObtained(token));
}

export default function* loginSaga(): Generator {
    yield takeLatest(AuthActions.login.fulfilled.type, afterSuccessfulLogin);
}
