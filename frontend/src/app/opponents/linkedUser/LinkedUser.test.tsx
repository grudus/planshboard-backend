import React from "react";
import { mockTranslations } from "utils/testUtils";
import { render } from "@testing-library/react";
import LinkedUser from "app/opponents/linkedUser/LinkedUser";
import { Opponent } from "app/opponents/__models/OpponentModels";

beforeEach(() => {
    mockTranslations();
});

test("Should render linked user name", () => {
    const opponent: Opponent = {
        id: 1,
        name: "Opponent name",
        linkedUser: {
            userName: "User name",
            userId: 1,
            status: "WAITING_FOR_CONFIRMATION",
        },
    };
    const { getByText } = render(<LinkedUser opponent={opponent} />);
    const title = getByText("User name");

    expect(title).toBeInTheDocument();
});

test("Should empty space when no linked user", () => {
    const opponent: Opponent = {
        id: 1,
        name: "Opponent name",
    };
    const { container } = render(<LinkedUser opponent={opponent} />);
    const text = container.textContent;

    expect(text?.trim()).toBeFalsy();
});

test("Should return translated value when linked user is creator", () => {
    const opponent: Opponent = {
        id: 1,
        name: "Opponent name",
        linkedUser: {
            userName: "User name",
            userId: 1,
            status: "LINKED_WITH_CREATOR",
        },
    };
    const { container } = render(<LinkedUser opponent={opponent} />);
    const text = container.textContent;

    expect(text).toMatch(/.*LINKED_WITH_CREATOR.*/i);
});

test("Should handle no opponent", () => {
    const { container } = render(<LinkedUser opponent={undefined} />);
    const text = container.textContent;

    expect(text?.trim()).toBeFalsy();
});
