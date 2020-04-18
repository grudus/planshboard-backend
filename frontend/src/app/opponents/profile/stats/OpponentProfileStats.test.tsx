import React from "react";
import { render } from "@testing-library/react";
import OpponentProfileStats from "app/opponents/profile/stats/OpponentProfileStats";
import { mockRedux, mockTranslations } from "utils/testUtils";

beforeEach(() => {
    mockRedux({});
    mockTranslations();
});

test("Should render board game names with corresponding number", () => {
    const stats = {
        numberOfPlays: 254,
        numberOfWins: 133,
        lastPlayedBoardGame: "Osadnicy z Katanu",
        mostPlayedBoardGame: {
            name: "Carcassone",
            plays: 31,
        },
        mostWinsBoardGame: {
            name: "Dobble",
            wins: 23,
        },
    };
    const { getByText } = render(<OpponentProfileStats stats={stats} />);

    ["Osadnicy z Katanu", "Carcassone (31)", "Dobble (23)"].forEach(name => {
        expect(getByText(name)).toBeInTheDocument();
    });
});

test("Should return hypen when no board game", () => {
    const stats = {
        numberOfPlays: 254,
        numberOfWins: 133,
        lastPlayedBoardGame: "Osadnicy z Katanu",
        mostWinsBoardGame: {
            name: "Dobble",
            wins: 23,
        },
    };
    const { getByText } = render(<OpponentProfileStats stats={stats} />);

    expect(getByText("-")).toBeInTheDocument();
});

test("Should show number stats properly", () => {
    const stats = {
        numberOfPlays: 200,
        numberOfWins: 100,
    };
    const { getByText } = render(<OpponentProfileStats stats={stats} />);

    ["200", "100", "50%"].forEach(number => {
        expect(getByText(number)).toBeInTheDocument();
    });
});
