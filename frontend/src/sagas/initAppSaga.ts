import { put } from "redux-saga/effects";

export default function* initApp() {
    yield put({ type: "APP_INITIALIZED" });
}
