import { put, takeEvery } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import {
    httpErrorAction,
    httpRequestAction,
    httpSuccessAction,
    WaitHttpRequestPayload,
} from "app/shared/store/httpRequestActions";
import { fetchJson, postFormRequest } from "utils/httpUtils";

function* doHttpRequest(action: PayloadAction<WaitHttpRequestPayload>): Generator {
    try {
        const response = action.payload.isForm
            ? yield postFormRequest(action.payload)
            : yield fetchJson(action.payload);

        yield put(httpSuccessAction(response));
        if (action.payload.successAction) yield put(action.payload.successAction(response));
        action.payload.resolve?.(response);
    } catch (e) {
        yield put(httpErrorAction(e));
        if (action.payload.errorAction) yield put(action.payload.errorAction(e));
        action.payload.reject?.(e);
    }
}

export default function* httpRequestSaga(): Generator {
    yield takeEvery(httpRequestAction.type, doHttpRequest);
}
