import React from "react";
import { render, fireEvent } from "@testing-library/react";
import PasswordInput from "library/password-input/PasswordInput";
import IconEye from "./icon-eye.svg";
import IconEyeOff from "./icon-eye-off.svg";
import { mockRedux } from "../../utils/testUtils";

beforeAll(mockRedux);

test("Should generate label correctly", () => {
    const { getByLabelText } = render(<PasswordInput label="Label" name="Name" />);
    const label = getByLabelText(/Label/i);
    expect(label).toBeInTheDocument();
});

test("Should have eye icon by default", () => {
    const { getByText } = render(<PasswordInput label="Label" name="Name" />);
    const svg = getByText(IconEye);
    expect(svg).toBeInTheDocument();
});

test("Should change icon to closed eye after click on open eye", () => {
    const { getByText, container } = render(<PasswordInput label="Label" name="Name" />);
    const button = container.querySelector("button") as HTMLButtonElement;
    fireEvent.click(button);
    const eyeClosed = getByText(IconEyeOff);
    expect(eyeClosed).toBeInTheDocument();
});

test("Should change input type after click on the open eye", () => {
    const { container } = render(<PasswordInput label="Label" name="Name" />);
    const button = container.querySelector("button") as HTMLButtonElement;
    fireEvent.click(button);
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input.type).toBe("text");
});
