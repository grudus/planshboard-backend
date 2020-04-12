import initCurrentUserSaga from "app/user/sagas/initCurrentUserSaga";
import { authTokenObtainedAction } from "app/auth/store/authActions";
import SagaTester from "redux-saga-tester";
import { getCurrentUserSuccessAction } from "app/user/store/userActions";
import { testTypeRootReducer } from "store/rootReducer";
import httpRequestSaga from "app/shared/sagas/httpRequestSaga";

test("Should listen to app initialized and token obtained actions", () => {
    const saga = initCurrentUserSaga();
    const next = saga.next();

    expect(next.value.payload.args[0]).toStrictEqual(["APP_INITIALIZED", authTokenObtainedAction.type]);
});

test("Should set current user after successful http request", async () => {
    const sagaTester = new SagaTester({ initialState: undefined, reducers: testTypeRootReducer });
    sagaTester.start(initCurrentUserSaga);
    sagaTester.start(httpRequestSaga);

    const mockResponse = { text: () => Promise.resolve(JSON.stringify({ id: 1, username: "user" })) };
    window.fetch = jest.fn().mockImplementation(() => mockResponse);

    sagaTester.dispatch(authTokenObtainedAction(""));

    await sagaTester.waitFor(getCurrentUserSuccessAction.type);

    const finalState = sagaTester.getState();
    expect(finalState.user.current?.id).toBe(1);
    expect(finalState.user.current?.username).toBe("user");
});
