import React from "react";
import { render } from "@testing-library/react";
import OpponentRadio from "app/opponents/form/checkbox/OpponentRadio";

test("Should render title properly", () => {
    const { getByText } = render(<OpponentRadio selectedValue="a" value="a" icon={<div />} title="New opponent" />);

    const title = getByText("New opponent");
    expect(title).toBeInTheDocument();
});
