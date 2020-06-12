import React from "react";
import { useRedux } from "store/rootReducer";
import Dropdown, { DropdownProps } from "library/dropdown/Dropdown";

interface OpponentsDropdownProps extends Partial<DropdownProps<any>> {
    alreadyUsedOpponents?: Set<number>;
}

const OpponentsDropdown: React.FC<OpponentsDropdownProps> = props => {
    const opponents = useRedux(state => state.opponent.list);

    const options = opponents
        .filter(op => !props.alreadyUsedOpponents?.has(op.id))
        .map(op => ({ label: op.name, value: op }));

    const onSelect = (a: any) => {
        props.onSelect?.(a.value);
    };

    return <Dropdown options={options} {...props} onSelect={onSelect} />;
};

export default OpponentsDropdown;
