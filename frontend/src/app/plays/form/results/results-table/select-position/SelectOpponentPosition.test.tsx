import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SelectOpponentPosition from "./SelectOpponentPosition";
import { PlayResultRow } from "app/plays/__models/PlayModels";

test("Should render all positions", () => {
    const result: PlayResultRow = {
        opponent: {
            id: 1,
            name: "Name",
        },
    };
    const { getByText } = render(<SelectOpponentPosition numberOfPositions={4} result={result} onChange={jest.fn} />);

    ["1", "2", "3", "4"].forEach(position => {
        expect(getByText(position)).toBeInTheDocument();
    });
});

test("Should set checked state", () => {
    const result: PlayResultRow = {
        opponent: {
            id: 1,
            name: "Name",
        },
        position: 3,
    };
    const { container } = render(<SelectOpponentPosition numberOfPositions={4} result={result} onChange={jest.fn} />);

    const label = container.querySelector("input[checked]");
    expect(label).toBeInTheDocument();
});

test("No input should be checked when no position specified", () => {
    const result: PlayResultRow = {
        opponent: {
            id: 1,
            name: "Name",
        },
    };
    const { container } = render(<SelectOpponentPosition numberOfPositions={4} result={result} onChange={jest.fn} />);

    const label = container.querySelector("input[checked]");
    expect(label).not.toBeInTheDocument();
});

test("Should call on change properly", () => {
    const onChange = jest.fn();
    const result: PlayResultRow = {
        opponent: {
            id: 1,
            name: "Name",
        },
    };
    const { getByText } = render(<SelectOpponentPosition numberOfPositions={4} result={result} onChange={onChange} />);

    const querySelector = getByText("3").parentElement!!.querySelector("input")!!;
    console.log(querySelector);
    userEvent.click(querySelector);
    expect(onChange).toBeCalledWith({ ...result, position: 3 });
});
