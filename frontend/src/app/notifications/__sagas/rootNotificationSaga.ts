import { all } from "redux-saga/effects";
import initNotificationsSaga from "app/notifications/__sagas/initNotificationsSaga";

function* rootNotificationsSaga(): Generator {
    yield all([initNotificationsSaga()]);
}

export default rootNotificationsSaga;
