import { all } from "redux-saga/effects";
import initAppSaga from "./initAppSaga";

function* rootSaga() {
    yield all([initAppSaga()]);
}

export default rootSaga;
