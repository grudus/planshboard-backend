import React from "react";
import { render } from "@testing-library/react";
import BoardGameList from "./BoardGameList";
import { mockHttpDispatch, mockRedux } from "utils/testUtils";

beforeEach(() => {
    mockHttpDispatch();
});

test("Should display all items", () => {
    mockRedux({
        boardGames: {
            list: [
                { id: 1, name: "Item1" },
                { id: 2, name: "Item2" },
            ],
        },
    });
    const { getByText } = render(<BoardGameList />);
    const game1 = getByText(/Item1/i);
    const game2 = getByText(/Item2/i);

    expect(game1).toBeInTheDocument();
    expect(game2).toBeInTheDocument();
});

test("Should display nothing when no items at all", () => {
    mockRedux({
        boardGames: {
            list: [],
        },
    });
    const { container } = render(<BoardGameList />);

    expect(container.textContent).toBe("");
});
