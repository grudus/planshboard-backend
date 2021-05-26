import { put } from "redux-saga/effects";
import NotificationActions from "app/notifications/__store/notificationActions";
import { appLoadedForUser } from "sagas/appLoadedForUser";

function* initNotifications() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    yield put(NotificationActions.fetchInitial());
}

export default function* initNotificationsSaga(): Generator {
    yield appLoadedForUser(initNotifications);
}
