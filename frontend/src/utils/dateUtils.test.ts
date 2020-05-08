import { formatFullDate } from "utils/dateUtils";

test("Should format date correctly", () => {
    const date = new Date(2020, 5, 8);

    const formatted = formatFullDate(date);

    expect(formatted).toBe("08.06.2020");
});

test("Should handle undefined", () => {
    const formatted = formatFullDate(undefined);

    expect(formatted).toBe("");
});
