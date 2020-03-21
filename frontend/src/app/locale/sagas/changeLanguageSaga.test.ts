import changeLocaleSaga from "./changeLanguageSaga";
import { changeLanguage, changeLanguageSuccess } from "../store/localeActions";
import SagaTester from "redux-saga-tester";
import * as languageEn from "../language-en.json";
import * as languagePl from "../language-pl.json";
import { planshboardStore } from "store/configureStore";

test("Should listen to change language action type", () => {
    const saga = changeLocaleSaga();
    const next = saga.next();

    expect(next.value.payload.args[0]).toBe(changeLanguage.type);
});

test("Should download and return translations ", async () => {
    const sagaTester = new SagaTester({ initialState: undefined, reducers: planshboardStore.getState });
    sagaTester.start(changeLocaleSaga);

    sagaTester.dispatch(changeLanguage("en"));

    await sagaTester.waitFor(changeLanguageSuccess.type);
    const finalState = sagaTester.getState();

    expect(finalState.locale.language).toBe("en");
});

test("Should download proper translation for different languages", async () => {
    (languageEn as any).default = { LANG: "EN" };
    (languagePl as any).default = { LANG: "PL" };
    const sagaTester = new SagaTester({ initialState: undefined, reducers: planshboardStore.getState });
    sagaTester.start(changeLocaleSaga);

    sagaTester.dispatch(changeLanguage("en"));
    await sagaTester.waitFor(changeLanguageSuccess.type);

    expect(sagaTester.getState().locale.translations).toStrictEqual({ LANG: "EN" });
    sagaTester.reset(true);

    sagaTester.dispatch(changeLanguage("pl"));
    await sagaTester.waitFor(changeLanguageSuccess.type);

    expect(sagaTester.getState().locale.translations).toStrictEqual({ LANG: "PL" });
});
