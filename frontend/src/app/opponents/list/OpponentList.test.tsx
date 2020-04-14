import React from "react";
import { mockHttpDispatch, mockRedux, mockTranslations } from "utils/testUtils";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import OpponentList from "app/opponents/list/OpponentList";
import userEvent from "@testing-library/user-event";

jest.mock("react-flip-move", () => {
    // eslint-disable-next-line react/display-name
    return (props: any) => <ul>{props.children}</ul>;
});

beforeEach(() => {
    mockHttpDispatch();
    mockTranslations({});
});

test("Should render opponent", () => {
    const opponents = [randomOpponent(1, "Opponent name")];

    mockRedux({ opponent: { list: opponents } });

    const { getByText } = render(
        <MemoryRouter>
            <OpponentList />
        </MemoryRouter>,
    );
    const title = getByText(/Opponent name/i);

    expect(title).toBeInTheDocument();
});

test("Should render multiple opponents", () => {
    const opponents = [...Array(15).keys()].map(i => randomOpponent(i, `${i}`));

    mockRedux({ opponent: { list: opponents } });

    const { container } = render(
        <MemoryRouter>
            <OpponentList />
        </MemoryRouter>,
    );
    const list = container.querySelectorAll("li");

    expect(list.length).toBe(15);
});

test("Should filter items", async () => {
    const prefixes = ["alfa", "beta", "gamma"];
    const opponents = [...Array(9).keys()].map(i => randomOpponent(i, `${prefixes[i % 3]}${i}`));

    mockRedux({ opponent: { list: opponents } });

    const { container } = render(
        <MemoryRouter>
            <OpponentList />
        </MemoryRouter>,
    );
    const inputSearch = container.querySelector("input")!!;
    await userEvent.type(inputSearch, "alfa");

    const list = container.querySelectorAll("li");
    expect(list.length).toBe(3);
});

function randomOpponent(id: number, name: string) {
    return {
        id,
        name,
        numberOfPlays: 1,
        numberOfWins: 1,
    };
}
