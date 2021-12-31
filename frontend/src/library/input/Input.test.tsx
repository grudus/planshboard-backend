import React from "react";
import { render } from "@testing-library/react";
import Input from "./Input";
import { mockRedux } from "../../utils/testUtils";

beforeAll(mockRedux);

test("Should generate label correctly", () => {
    const { getByLabelText } = render(<Input label="Label" name="Name" />);
    const label = getByLabelText(/Label/i);
    expect(label).toBeInTheDocument();
});

test("Should display error", () => {
    const { getByText } = render(<Input label="Label" name="Name" error="Error value" />);
    const error = getByText(/Error value/i);
    expect(error).toBeInTheDocument();
});

test("Error should have proper role", () => {
    const { getByRole } = render(<Input label="Label" name="Name" error="Error value" />);
    const error = getByRole(/alert/i);
    expect(error).toBeInTheDocument();
});

test("Should display initial value", () => {
    const { getByDisplayValue } = render(<Input label="Label" name="Name" initialValue="Initial" />);
    const value = getByDisplayValue(/Initial/i);
    expect(value).toBeInTheDocument();
});

test("Should be able to add any icon", () => {
    const { getByText } = render(<Input label="Label" name="Name" frontIcon={<div>Hi Icon</div>} />);
    const icon = getByText(/Hi Icon/i);
    expect(icon).toBeInTheDocument();
});
