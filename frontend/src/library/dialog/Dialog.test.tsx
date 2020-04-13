import React from "react";
import { render } from "@testing-library/react";
import Dialog from "./Dialog";

test("Dialog should display nothing when not open", () => {
    const { queryByText } = render(
        <Dialog open={false} onCancel={jest.fn}>
            <h1>Tekst</h1>
        </Dialog>,
    );
    const text = queryByText(/Tekst/i);
    expect(text).not.toBeInTheDocument();
});

test("Dialog should display children when open", () => {
    const { queryByText } = render(
        <Dialog open={true} onCancel={jest.fn}>
            <h1>Tekst</h1>
        </Dialog>,
    );
    const text = queryByText(/Tekst/i);
    expect(text).toBeInTheDocument();
});
