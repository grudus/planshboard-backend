import { all } from "redux-saga/effects";
import initCurrentUserSaga from "app/user/__sagas/initCurrentUserSaga";

function* rootUserSaga(): Generator {
    yield all([initCurrentUserSaga()]);
}

export default rootUserSaga;
