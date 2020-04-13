import React from "react";
import { render } from "@testing-library/react";
import BoardGameList from "./BoardGameList";
import { mockHttpDispatch, mockRedux } from "utils/testUtils";
import { MemoryRouter } from "react-router-dom";

beforeEach(() => {
    mockHttpDispatch();
});

test("Should display all items", () => {
    mockRedux({
        boardGame: {
            list: [
                { id: 1, name: "Item1" },
                { id: 2, name: "Item2" },
            ],
        },
        locale: {},
    });
    const { getByText } = render(
        <MemoryRouter>
            <BoardGameList />
        </MemoryRouter>,
    );
    const game1 = getByText(/Item1/i);
    const game2 = getByText(/Item2/i);

    expect(game1).toBeInTheDocument();
    expect(game2).toBeInTheDocument();
});
