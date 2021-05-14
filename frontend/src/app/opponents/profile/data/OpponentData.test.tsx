import React from "react";
import { render } from "@testing-library/react";
import { mockTranslations } from "utils/testUtils";
import OpponentData from "app/opponents/profile/data/OpponentData";
import { Opponent } from "app/opponents/__models/OpponentModels";

beforeEach(() => {
    mockTranslations();
});

test("Should render opponent name", () => {
    const opponent: Opponent = {
        id: 1,
        name: "Opponent name",
    };
    const { getByText } = render(<OpponentData opponent={opponent} />);

    expect(getByText(opponent.name)).toBeInTheDocument();
});

test("Should render name of user linked to opponent", () => {
    const opponent: Opponent = {
        id: 1,
        name: "Opponent name",
        linkedUser: {
            status: "ENABLED",
            userId: 1,
            userName: "User name",
        },
    };
    const { getByText } = render(<OpponentData opponent={opponent} />);

    expect(getByText(opponent.linkedUser!.userName)).toBeInTheDocument();
});

test("Should not render linked opponent name when opponent is for current user", () => {
    const opponent: Opponent = {
        id: 1,
        name: "Opponent name",
        linkedUser: {
            status: "LINKED_WITH_CREATOR",
            userId: 1,
            userName: "User name",
        },
    };
    const { queryByText } = render(<OpponentData opponent={opponent} />);

    expect(queryByText(opponent.linkedUser!.userName)).not.toBeInTheDocument();
});
