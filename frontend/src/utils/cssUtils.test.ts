import { merge } from "./cssUtils";

test("Should merge multiple classes", () => {
    const class1 = "class1";
    const class2 = "class2";
    const class3 = "class3";
    const merged = merge(class1, class2, class3);
    expect(merged).toBe(`${class1} ${class2} ${class3}`);
});

test("Should return class when merging only one class", () => {
    const class1 = "class1";
    const merged = merge(class1);
    expect(merged).toBe(class1);
});
