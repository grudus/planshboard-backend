import { all } from "redux-saga/effects";
import loginSaga from "app/auth/sagas/loginSaga";

function* rootAuthSaga(): Generator {
    yield all([loginSaga()]);
}

export default rootAuthSaga;
