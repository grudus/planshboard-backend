import { getNestedTranslation } from "./objectUtils";
import { Translations } from "../app/locale/store/localeStore";

const translationJson: Translations = {
    key1: {
        nested1: { property: "TEST1" },
    },
    key2: "TEST2",
};

test("Should get nested translation property", () => {
    const property = getNestedTranslation("key1.nested1.property", translationJson);
    expect(property).toBe("TEST1");
});

test("Should get flat translation property", () => {
    const property = getNestedTranslation("key2", translationJson);
    expect(property).toBe("TEST2");
});

test("Should get JSON representation of property when more nesting exists", () => {
    const property = getNestedTranslation("key1.nested1", translationJson);
    expect(property).toBe(JSON.stringify({ property: "TEST1" }));
});

test("Should return given key when no translation was found", () => {
    const KEY = "notFoundKey";
    const property = getNestedTranslation(KEY, translationJson);
    expect(property).toBe(KEY);
});
