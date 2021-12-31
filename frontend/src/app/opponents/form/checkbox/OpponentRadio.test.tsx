import React from "react";
import { render } from "@testing-library/react";
import OpponentRadio from "app/opponents/form/checkbox/OpponentRadio";
import { mockRedux } from "../../../../utils/testUtils";

beforeAll(mockRedux);

test("Should render title properly", () => {
    const { getByText } = render(
        <OpponentRadio secondaryText="alf" selectedValue="a" value="a" icon={<div />} title="New opponent" />,
    );

    const title = getByText("New opponent");
    expect(title).toBeInTheDocument();
});
