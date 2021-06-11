import React from "react";
import { render } from "@testing-library/react";
import BoardGameListItem from "./BoardGameListItem";
import { MemoryRouter } from "react-router-dom";
import { mockTranslations } from "utils/testUtils";

test("Should display board game name", () => {
    mockTranslations();
    const { getByText } = render(
        <MemoryRouter>
            <BoardGameListItem game={{ id: 1, name: "Game" }} />
        </MemoryRouter>,
    );
    const label = getByText(/Game/i);
    expect(label).toBeInTheDocument();
});
