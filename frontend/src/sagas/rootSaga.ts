import { all, put } from "redux-saga/effects";
import httpErrorHandlerSaga from "app/shared/sagas/httpErrorHandlerSaga";
import loginSaga from "app/auth/__sagas/loginSaga";
import logoutSaga from "app/auth/__sagas/logoutSaga";
import initCurrentUserSaga from "app/user/__sagas/initCurrentUserSaga";
import initNotificationsSaga from "app/notifications/__sagas/initNotificationsSaga";

function* rootSaga(): Generator {
    yield all([
        put({ type: "APP_INITIALIZED" }),
        httpErrorHandlerSaga(),
        loginSaga(),
        logoutSaga(),
        initCurrentUserSaga(),
        initNotificationsSaga(),
    ]);
}

export default rootSaga;
