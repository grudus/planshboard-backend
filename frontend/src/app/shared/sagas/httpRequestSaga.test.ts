import httpRequestSaga from "app/shared/sagas/httpRequestSaga";
import { httpRequestAction, httpSuccessAction } from "app/shared/store/httpRequestActions";
import SagaTester from "redux-saga-tester";
import { testTypeRootReducer } from "store/rootReducer";
import * as httpUtils from "utils/httpUtils";
import { emptyTestState, mock } from "utils/testUtils";

test("Should listen to the http request action type", () => {
    const saga = httpRequestSaga();
    const next = saga.next();

    expect(next.value.payload.args[0]).toBe(httpRequestAction.type);
});

test("Should call form action when payload is form", async () => {
    const sagaTester = new SagaTester({ initialState: undefined, reducers: testTypeRootReducer });
    sagaTester.start(httpRequestSaga);

    mock(httpUtils, "postFormRequest", jest.fn());

    sagaTester.dispatch(httpRequestAction({ path: "", type: "post", body: {}, isForm: true }));

    await sagaTester.waitFor(httpSuccessAction.type);

    expect(httpUtils.postFormRequest).toBeCalled();
});

test("Should call json action when payload is not form", async () => {
    const sagaTester = new SagaTester({ initialState: undefined, reducers: testTypeRootReducer });
    sagaTester.start(httpRequestSaga);

    mock(httpUtils, "fetchJson", jest.fn());

    sagaTester.dispatch(httpRequestAction({ path: "", type: "post" }));

    await sagaTester.waitFor(httpSuccessAction.type);

    expect(httpUtils.fetchJson).toBeCalled();
});

test("Should attach token to http request", async () => {
    const sagaTester = new SagaTester({
        initialState: { ...emptyTestState, auth: { token: "token" } },
        reducers: testTypeRootReducer,
    });
    sagaTester.start(httpRequestSaga);

    mock(httpUtils, "fetchJson", jest.fn());

    sagaTester.dispatch(httpRequestAction({ path: "", type: "post" }));

    await sagaTester.waitFor(httpSuccessAction.type);

    expect(httpUtils.fetchJson).toBeCalledWith(expect.anything(), "token");
});

test("Should execute request without token when empty store", async () => {
    const sagaTester = new SagaTester({ initialState: undefined, reducers: testTypeRootReducer });
    sagaTester.start(httpRequestSaga);

    mock(httpUtils, "fetchJson", jest.fn());

    sagaTester.dispatch(httpRequestAction({ path: "", type: "post" }));

    await sagaTester.waitFor(httpSuccessAction.type);

    expect(httpUtils.fetchJson).toBeCalledWith(expect.anything(), undefined);
});
