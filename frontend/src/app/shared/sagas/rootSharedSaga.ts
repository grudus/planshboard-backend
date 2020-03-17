import { all } from "redux-saga/effects";
import httpRequestSaga from "app/shared/sagas/httpRequestSaga";

function* rootSharedSaga(): Generator {
    yield all([httpRequestSaga()]);
}

export default rootSharedSaga;
