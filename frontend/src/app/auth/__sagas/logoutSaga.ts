import { put, takeEvery } from "redux-saga/effects";
import { logoutAction } from "app/auth/__store/authActions";
import { push } from "connected-react-router";
import { appRoutes } from "app/routing/routes";

function* logout(): Generator {
    yield put(push(appRoutes.auth.login));
}

export default function* logoutSaga(): Generator {
    yield takeEvery(logoutAction.type, logout);
}
