import { all } from "redux-saga/effects";
import initAppSaga from "./initAppSaga";
import rootLocaleSaga from "../app/locale/sagas/rootLocaleSaga";

function* rootSaga(): Generator {
    yield all([initAppSaga(), rootLocaleSaga()]);
}

export default rootSaga;
