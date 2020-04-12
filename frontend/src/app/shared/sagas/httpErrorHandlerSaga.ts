import { put, takeEvery } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { httpErrorAction } from "app/shared/store/httpRequestActions";
import { logoutAction } from "app/auth/store/authActions";

function* catchError(action: PayloadAction<Response | string>): Generator {
    if (typeof action.payload === "string") {
        const body = JSON.parse(action.payload);

        if (body?.status === 403) yield put(logoutAction());
    }
}

export default function* httpRequestSaga(): Generator {
    yield takeEvery(httpErrorAction.type, catchError);
}
