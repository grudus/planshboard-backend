import React from "react";
import { render } from "@testing-library/react";
import BoardGameListItem from "./BoardGameListItem";

test("Should display board game name", () => {
    const { getByText } = render(<BoardGameListItem game={{ id: 1, name: "Game" }} />);
    const label = getByText(/Game/i);
    expect(label).toBeInTheDocument();
});
