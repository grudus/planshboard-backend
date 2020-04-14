import React from "react";
import { mockHttpDispatch, mockRedux, mockTranslations } from "utils/testUtils";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import OpponentList from "app/opponents/list/OpponentList";

beforeEach(() => {
    mockHttpDispatch();
    mockTranslations({});
});

test("Should render opponent", () => {
    const opponents = [
        {
            id: 1,
            name: "Opponent name",
            numberOfPlays: 1,
            numberOfWins: 1,
        },
    ];

    mockRedux({ opponent: { list: opponents } });

    const { getByText } = render(
        <MemoryRouter>
            <OpponentList />
        </MemoryRouter>,
    );
    const title = getByText(/Opponent name/i);

    expect(title).toBeInTheDocument();
});
