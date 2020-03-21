import { all } from "redux-saga/effects";
import httpRequestSaga from "app/shared/sagas/httpRequestSaga";
import httpErrorHandlerSaga from "app/shared/sagas/httpErrorHandlerSaga";

function* rootSharedSaga(): Generator {
    yield all([httpRequestSaga(), httpErrorHandlerSaga()]);
}

export default rootSharedSaga;
