import { all } from "redux-saga/effects";
import initAppSaga from "./initAppSaga";
import rootLocaleSaga from "../app/locale/__sagas/rootLocaleSaga";
import rootSharedSaga from "app/shared/sagas/rootSharedSaga";
import rootAuthSaga from "app/auth/__sagas/rootAuthSaga";
import rootUserSaga from "app/user/__sagas/rootUserSaga";
import rootNotificationSaga from "app/notifications/__sagas/rootNotificationSaga";

function* rootSaga(): Generator {
    yield all([
        initAppSaga(),
        rootLocaleSaga(),
        rootSharedSaga(),
        rootAuthSaga(),
        rootUserSaga(),
        rootNotificationSaga(),
    ]);
}

export default rootSaga;
