import React from "react";
import { fireEvent, render } from "@testing-library/react";
import ConfirmDialog from "library/dialog/confirm-dialog/ConfirmDialog";
import { mockRedux } from "../../../utils/testUtils";

beforeAll(mockRedux);

test("Should display nothing when closed", () => {
    const { queryByText } = render(
        <ConfirmDialog
            title="Title"
            text="text"
            confirmButtonText="Confirm"
            cancelButtonText="Cancel"
            open={false}
            onConfirm={jest.fn}
            onCancel={jest.fn}
        />,
    );
    const text = queryByText(/Tekst/i);
    expect(text).not.toBeInTheDocument();
});

test("Should display text when open", () => {
    const { queryByText } = render(
        <ConfirmDialog
            title="Title"
            text="text"
            confirmButtonText="Confirm"
            cancelButtonText="Cancel"
            open={true}
            onConfirm={jest.fn}
            onCancel={jest.fn}
        />,
    );
    const text = queryByText(/text/i);
    expect(text).toBeInTheDocument();
});

test("Should display title when open", () => {
    const { queryByText } = render(
        <ConfirmDialog
            title="Title"
            text="text"
            confirmButtonText="Confirm"
            cancelButtonText="Cancel"
            open={true}
            onConfirm={jest.fn}
            onCancel={jest.fn}
        />,
    );
    const text = queryByText(/Title/i);
    expect(text).toBeInTheDocument();
});

test("Should confirm dialog when clicking on confirm button", () => {
    const onConfirm = jest.fn();
    const { getByText } = render(
        <ConfirmDialog
            title="Title"
            text="text"
            confirmButtonText="Confirm"
            cancelButtonText="Cancel"
            open={true}
            onConfirm={onConfirm}
            onCancel={jest.fn}
        />,
    );
    const button = getByText(/Confirm/i);
    fireEvent.click(button);

    expect(onConfirm).toBeCalled();
});

test("Should cancel dialog when clicking on cancel button", () => {
    const onCancel = jest.fn();
    const { getByText } = render(
        <ConfirmDialog
            title="Title"
            text="text"
            confirmButtonText="Confirm"
            cancelButtonText="Cancel"
            open={true}
            onConfirm={jest.fn}
            onCancel={onCancel}
        />,
    );
    const button = getByText(/Cancel/i);
    fireEvent.click(button);

    expect(onCancel).toBeCalled();
});
