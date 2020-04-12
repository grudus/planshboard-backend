import React from "react";
import { render } from "@testing-library/react";
import BoardGameListItem from "./BoardGameListItem";
import { MemoryRouter } from "react-router-dom";

test("Should display board game name", () => {
    const { getByText } = render(
        <MemoryRouter>
            <BoardGameListItem game={{ id: 1, name: "Game" }} />
        </MemoryRouter>,
    );
    const label = getByText(/Game/i);
    expect(label).toBeInTheDocument();
});
