import { put } from "redux-saga/effects";
import { httpRequestAction } from "app/shared/store/httpRequestActions";
import { apiRoutes } from "app/routing/routes";
import { getCurrentUserSuccessAction } from "app/user/__store/userActions";
import { appLoadedForUser } from "sagas/appLoadedForUser";

function* initCurrentUser() {
    yield put(
        httpRequestAction({
            type: "get",
            path: apiRoutes.user.current,
            successAction: getCurrentUserSuccessAction,
        }),
    );
}

export default function* initCurrentUserSaga(): Generator {
    yield appLoadedForUser(initCurrentUser);
}
