import { put } from "redux-saga/effects";
import { httpRequestAction } from "app/shared/store/httpRequestActions";
import { apiRoutes } from "app/routing/routes";
import { fetchInitialNotificationsSuccess } from "app/notifications/__store/notificationActions";
import { appLoadedForUser } from "sagas/appLoadedForUser";

function* initNotifications() {
    yield put(
        httpRequestAction({
            type: "get",
            path: apiRoutes.notifications.paginated(20),
            successAction: fetchInitialNotificationsSuccess,
        }),
    );
}

export default function* initNotificationsSaga(): Generator {
    yield appLoadedForUser(initNotifications);
}
