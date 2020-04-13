import { all } from "redux-saga/effects";
import loginSaga from "app/auth/__sagas/loginSaga";
import logoutSaga from "app/auth/__sagas/logoutSaga";

function* rootAuthSaga(): Generator {
    yield all([loginSaga(), logoutSaga()]);
}

export default rootAuthSaga;
