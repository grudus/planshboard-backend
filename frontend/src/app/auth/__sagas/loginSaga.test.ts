import loginSaga from "app/auth/__sagas/loginSaga";
import SagaTester from "redux-saga-tester";
import httpRequestSaga from "app/shared/sagas/httpRequestSaga";
import { httpErrorAction } from "app/shared/store/httpRequestActions";
import { testTypeRootReducer } from "store/rootReducer";
import AuthActions from "app/auth/__store/authActions";

test("Should listen for try to login action", () => {
    const saga = loginSaga();
    const next = saga.next();

    expect(next.value.payload.args[0]).toBe(AuthActions.tryToLogin.type);
});

test("Should save extract token from response header and store it in the store", async () => {
    const sagaTester = new SagaTester({ initialState: undefined, reducers: testTypeRootReducer });
    sagaTester.start(loginSaga);
    sagaTester.start(httpRequestSaga);

    const mockResponse = { text: () => Promise.resolve(), headers: new Map([["Authorization", "abc"]]) };
    window.fetch = jest.fn().mockImplementation(() => mockResponse);

    sagaTester.dispatch(AuthActions.tryToLogin({ username: "user", password: "pass" }));

    await sagaTester.waitFor(AuthActions.authTokenObtained.type);
    const finalState = sagaTester.getState();

    expect(finalState.auth.token).toBe("abc");
});

test("Store should not be changed after invalid login attempt", async () => {
    const sagaTester = new SagaTester({ initialState: undefined, reducers: testTypeRootReducer });
    sagaTester.start(loginSaga);
    sagaTester.start(httpRequestSaga);

    const mockResponse = { status: 401 };
    window.fetch = jest.fn().mockImplementation(() => mockResponse);

    sagaTester.dispatch(AuthActions.tryToLogin({ username: "user", password: "pass" }));

    await sagaTester.waitFor(httpErrorAction.type);

    const finalState = sagaTester.getState();
    expect(finalState.auth.token).toBeUndefined();
});
