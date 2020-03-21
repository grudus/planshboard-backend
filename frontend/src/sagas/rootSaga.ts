import { all } from "redux-saga/effects";
import initAppSaga from "./initAppSaga";
import rootLocaleSaga from "../app/locale/sagas/rootLocaleSaga";
import rootSharedSaga from "app/shared/sagas/rootSharedSaga";
import rootAuthSaga from "app/auth/sagas/rootAuthSaga";
import rootUserSaga from "app/user/sagas/rootUserSaga";

function* rootSaga(): Generator {
    yield all([initAppSaga(), rootLocaleSaga(), rootSharedSaga(), rootAuthSaga(), rootUserSaga()]);
}

export default rootSaga;
