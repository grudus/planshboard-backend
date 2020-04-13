import { useAnimatedVisibility } from "utils/hooks/useAnimatedVisibility";
import { act, renderHook } from "@testing-library/react-hooks";

beforeEach(() => {
    jest.useFakeTimers();
});
afterEach(() => {
    jest.clearAllTimers();
});

test("Should be visible instantly, but class should not be set", () => {
    const { result } = renderHook(() => useAnimatedVisibility(true, 500, "visible"));

    expect(result.current.visible).toBe(true);
    expect(result.current.visibleClass).toBe("");
});

test("Should set class after timeout", async () => {
    const timeout = 200;
    const classWhenVisible = "visible";
    const { result } = renderHook(() => useAnimatedVisibility(true, timeout, classWhenVisible));

    expect(result.current.visibleClass).toBe("");
    act(() => {
        jest.advanceTimersByTime(timeout + 100);
    });
    expect(result.current.visibleClass).toBe(classWhenVisible);
});
