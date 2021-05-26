import { all } from "redux-saga/effects";
import httpErrorHandlerSaga from "app/shared/sagas/httpErrorHandlerSaga";

function* rootSharedSaga(): Generator {
    yield all([httpErrorHandlerSaga()]);
}

export default rootSharedSaga;
