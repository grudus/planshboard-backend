import React from "react";
import { mockTranslations } from "utils/testUtils";
import { render } from "@testing-library/react";
import OpponentListItem from "app/opponents/list-item/OpponentListItem";
import { MemoryRouter } from "react-router-dom";

beforeEach(() => {
    mockTranslations();
});

test("Should render opponent's name", () => {
    const opponent = {
        id: 1,
        name: "Opponent name",
        numberOfPlays: 1,
        numberOfWins: 1,
    };
    const { getByText } = render(
        <MemoryRouter>
            <OpponentListItem opponent={opponent} />
        </MemoryRouter>,
    );
    const title = getByText(/Opponent name/i);

    expect(title).toBeInTheDocument();
});

test("Should render basic stats", () => {
    const opponent = {
        id: 1,
        name: "Opponent name",
        numberOfPlays: 200,
        numberOfWins: 30,
        lastPlayedBoardGame: "Carcassone",
    };
    const { getByText } = render(
        <MemoryRouter>
            <OpponentListItem opponent={opponent} />
        </MemoryRouter>,
    );
    const numberOfPlays = getByText(/200/i);
    const numberOfWins = getByText(/30/i);
    const winsRation = getByText(/15%/i);
    const lastPlayedGame = getByText(/Carcassone/i);

    [numberOfPlays, numberOfWins, winsRation, lastPlayedGame].forEach(text => {
        expect(text).toBeInTheDocument();
    });
});

test("Should render hypen when no last played game", () => {
    const opponent = {
        id: 1,
        name: "Opponent name",
        numberOfPlays: 200,
        numberOfWins: 30,
    };
    const { getByText } = render(
        <MemoryRouter>
            <OpponentListItem opponent={opponent} />
        </MemoryRouter>,
    );
    const lastPlayedGame = getByText(/-/i);

    expect(lastPlayedGame).toBeInTheDocument();
});

test("Should show 0% win ration when no count", () => {
    const opponent = {
        id: 1,
        name: "Opponent name",
        numberOfPlays: 0,
        numberOfWins: 0,
    };
    const { getByText } = render(
        <MemoryRouter>
            <OpponentListItem opponent={opponent} />
        </MemoryRouter>,
    );
    const winsRation = getByText(/0%/i);

    expect(winsRation).toBeInTheDocument();
});
