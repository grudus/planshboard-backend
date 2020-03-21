import { put, takeEvery } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { httpErrorAction } from "app/shared/store/httpRequestActions";
import { push } from "connected-react-router";

function* catchError(action: PayloadAction<Response>): Generator {
    const { status } = action.payload;

    if (status === 403) {
        yield put(push("/auth/login"));
    }
}

export default function* httpRequestSaga(): Generator {
    yield takeEvery(httpErrorAction.type, catchError);
}
