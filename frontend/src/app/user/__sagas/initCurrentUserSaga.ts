import { put, select, takeEvery } from "redux-saga/effects";
import { httpRequestAction } from "app/shared/store/httpRequestActions";
import { apiRoutes, routesWithoutAuth } from "app/routing/routes";
import { getCurrentUserSuccessAction } from "app/user/__store/userActions";
import { authTokenObtainedAction } from "app/auth/__store/authActions";
import { Store } from "store/rootReducer";

function shouldIgnoreCurrentUser(currentPath: string) {
    return currentPath && routesWithoutAuth.some(route => currentPath.startsWith(route));
}

function* initCurrentUser() {
    const currentPath = yield select((store: Store) => store?.router?.location?.pathname);

    if (shouldIgnoreCurrentUser(currentPath)) {
        return;
    }

    yield put(
        httpRequestAction({
            type: "get",
            path: apiRoutes.user.current,
            successAction: getCurrentUserSuccessAction,
        }),
    );
}

export default function* initCurrentUserSaga(): Generator {
    yield takeEvery(["APP_INITIALIZED", authTokenObtainedAction.type], initCurrentUser);
}
