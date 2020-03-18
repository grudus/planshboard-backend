import loginSaga from "app/auth/sagas/loginSaga";
import { tryToLoginAction } from "app/auth/store/authActions";

test("Should listen for try to login action", () => {
    const saga = loginSaga();
    const next = saga.next();

    expect(next.value.payload.args[0]).toBe(tryToLoginAction.type);
});
