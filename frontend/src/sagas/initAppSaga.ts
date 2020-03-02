import { put } from "redux-saga/effects";

export default function* initApp(): Generator {
    yield put({ type: "APP_INITIALIZED" });
}
