import { put } from "redux-saga/effects";
import UserActions from "app/user/__store/userActions";
import { appLoadedForUser } from "sagas/appLoadedForUser";

function* initCurrentUser() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    yield put(UserActions.getCurrentUser());
}

export default function* initCurrentUserSaga(): Generator {
    yield appLoadedForUser(initCurrentUser);
}
