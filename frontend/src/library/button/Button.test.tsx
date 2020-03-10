import React from "react";
import { render } from "@testing-library/react";
import Button from "./Button";

test("Should display button correctly", () => {
    const { getByText } = render(<Button text="My Button" />);
    const button = getByText(/My Button/i);
    expect(button).toBeInTheDocument();
});

test("Should set button type correctly", () => {
    const { getByText } = render(<Button text="My Button" type="submit" />);
    const button = getByText(/My Button/i);
    expect(button).toHaveAttribute("type", "submit");
});

test("Should set width to 100%", () => {
    const { container } = render(<Button text="My Button" fullWidth />);
    const button = container.firstChild;
    expect(button).toHaveClass("fullWidth");
});
