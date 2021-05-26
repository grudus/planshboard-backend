import initCurrentUserSaga from "app/user/__sagas/initCurrentUserSaga";
import AuthActions from "app/auth/__store/authActions";
import SagaTester from "redux-saga-tester";
import { getCurrentUserSuccessAction } from "app/user/__store/userActions";
import { testTypeRootReducer } from "store/rootReducer";
import httpRequestSaga from "app/shared/sagas/httpRequestSaga";

test("Should set current user after successful http request", async () => {
    const sagaTester = new SagaTester({ initialState: undefined, reducers: testTypeRootReducer });
    sagaTester.start(initCurrentUserSaga);
    sagaTester.start(httpRequestSaga);

    const mockResponse = { text: () => Promise.resolve(JSON.stringify({ id: 1, username: "user" })) };
    window.fetch = jest.fn().mockImplementation(() => mockResponse);

    sagaTester.dispatch(AuthActions.authTokenObtained(""));

    await sagaTester.waitFor(getCurrentUserSuccessAction.type);

    const finalState = sagaTester.getState();
    expect(finalState.user.current?.id).toBe(1);
    expect(finalState.user.current?.username).toBe("user");
});
