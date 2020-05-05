import React from "react";
import { useRedux } from "store/rootReducer";
import Dropdown, { DropdownProps } from "library/dropdown/Dropdown";

type OpponentsDropdownProps = Partial<DropdownProps<any>>;

const OpponentsDropdown: React.FC<OpponentsDropdownProps> = props => {
    const opponents = useRedux(state => state.opponent.list);

    const options = opponents.map(op => ({ label: op.name, value: op }));

    const onSelect = (a: any) => {
        props.onSelect?.(a.value);
    };

    return <Dropdown options={options} {...props} onSelect={onSelect} />;
};

export default OpponentsDropdown;
