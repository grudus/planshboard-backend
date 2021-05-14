import { select, takeEvery } from "redux-saga/effects";
import { authTokenObtainedAction } from "app/auth/__store/authActions";
import { Store } from "store/rootReducer";
import { routesWithoutAuth } from "app/routing/routes";

function* routeGuard(actionType: string, generatorToRun: () => any) {
    const currentPath = yield select((store: Store) => store?.router?.location?.pathname);
    const shouldIgnoreAuthPath = currentPath && routesWithoutAuth.some(route => currentPath.startsWith(route));
    if (actionType === "APP_INITIALIZED" && shouldIgnoreAuthPath) {
        return;
    }

    yield generatorToRun();
}

export function* appLoadedForUser(generatorToRun: () => any): Generator {
    yield takeEvery(["APP_INITIALIZED", authTokenObtainedAction.type], action =>
        routeGuard(action.type, generatorToRun),
    );
}
