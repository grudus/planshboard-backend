import changeLocaleSaga from "./changeLanguageSaga";
import { changeLanguage, changeLanguageSuccess } from "../__store/localeActions";
import SagaTester from "redux-saga-tester";
import { testTypeRootReducer } from "store/rootReducer";

test("Should listen to change language action type", () => {
    const saga = changeLocaleSaga();
    const next = saga.next();

    expect(next.value.payload.args[0]).toBe(changeLanguage.type);
});

test("Should download and return translations ", async () => {
    const sagaTester = new SagaTester({ initialState: undefined, reducers: testTypeRootReducer });
    sagaTester.start(changeLocaleSaga);

    sagaTester.dispatch(changeLanguage("en"));

    await sagaTester.waitFor(changeLanguageSuccess.type);
    const finalState = sagaTester.getState();

    expect(finalState.locale.language).toBe("en");
});

test("Should download proper translation for different languages", async () => {
    jest.doMock("../language-en.json", () => ({
        __esModule: true,
        default: { LANG: "EN" },
    }));
    jest.doMock("../language-pl.json", () => ({
        __esModule: true,
        default: { LANG: "PL" },
    }));
    const sagaTester = new SagaTester({ initialState: undefined, reducers: testTypeRootReducer });
    sagaTester.start(changeLocaleSaga);

    sagaTester.dispatch(changeLanguage("en"));
    await sagaTester.waitFor(changeLanguageSuccess.type);

    expect(sagaTester.getState().locale.translations).toStrictEqual({ LANG: "EN" });
    sagaTester.reset(true);

    sagaTester.dispatch(changeLanguage("pl"));
    await sagaTester.waitFor(changeLanguageSuccess.type);

    expect(sagaTester.getState().locale.translations).toStrictEqual({ LANG: "PL" });
});
