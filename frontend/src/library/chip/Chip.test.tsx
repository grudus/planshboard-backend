import React from "react";
import { render } from "@testing-library/react";
import Chip from "./Chip";

test("Should render chip text", () => {
    const { getByText } = render(<Chip text="Chip text" />);
    const chip = getByText("Chip text");
    expect(chip).toBeInTheDocument();
});

test("Should be disabled when specified", () => {
    const { container } = render(<Chip text="Chip text" disabled />);
    const chip = container.getElementsByTagName("button")[0];

    expect(chip.disabled).toBeTruthy();
});
