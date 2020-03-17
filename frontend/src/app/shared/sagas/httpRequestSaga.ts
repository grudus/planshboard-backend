import { put, takeEvery } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import {
    httpErrorAction,
    httpRequestAction,
    httpSuccessAction,
    WaitHttpRequestPayload,
} from "app/shared/store/httpRequestActions";
import { fetchRequest, postFormRequest } from "utils/httpUtils";

function* doHttpRequest(action: PayloadAction<WaitHttpRequestPayload>): Generator {
    try {
        const response = action.payload.isForm
            ? yield postFormRequest(action.payload)
            : yield fetchRequest(action.payload);

        yield put(httpSuccessAction(response));
        action.payload.resolve?.(response);
    } catch (e) {
        yield put(httpErrorAction(e));
        action.payload.reject?.(e);
    }
}

export default function* httpRequestSaga(): Generator {
    yield takeEvery(httpRequestAction.type, doHttpRequest);
}
