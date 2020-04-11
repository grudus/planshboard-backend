import { call, put, select, takeEvery } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import {
    httpErrorAction,
    httpRequestAction,
    httpSuccessAction,
    WaitHttpRequestPayload,
} from "app/shared/store/httpRequestActions";
import { fetchJson, postFormRequest } from "utils/httpUtils";
import { Store } from "store/rootReducer";

const getError = async (e: Response) => {
    return await e.text();
};

function* doHttpRequest(action: PayloadAction<WaitHttpRequestPayload>): Generator {
    const token = (yield select((store: Store) => store.auth.token)) as string | undefined;
    try {
        const response = action.payload.isForm
            ? yield postFormRequest(action.payload, token)
            : yield fetchJson(action.payload, token);

        yield put(httpSuccessAction(response));
        if (action.payload.successAction) yield put(action.payload.successAction(response));
        action.payload.resolve?.(response);
    } catch (e) {
        let error = e;
        if (e instanceof Response) {
            error = yield call(getError, e);
        }
        yield put(httpErrorAction(error));
        if (action.payload.errorAction) yield put(action.payload.errorAction(error));
        action.payload.reject?.(error);
    }
}

export default function* httpRequestSaga(): Generator {
    yield takeEvery(httpRequestAction.type, doHttpRequest);
}
