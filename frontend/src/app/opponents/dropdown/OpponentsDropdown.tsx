import React from "react";
import { useRedux } from "store/rootReducer";
import Dropdown, { DropdownProps } from "library/dropdown/Dropdown";
import { useHttpDispatch } from "app/shared/store/httpRequestActions";
import { createOpponentRequest } from "app/opponents/OpponentApi";
import { ValueType } from "react-select";

interface OpponentsDropdownProps extends Partial<DropdownProps<any>> {
    alreadyUsedOpponents?: Set<number>;
}

const OpponentsDropdown: React.FC<OpponentsDropdownProps> = props => {
    const opponents = useRedux(state => state.opponent.list);
    const dispatch = useHttpDispatch();

    const createOpponent = async (opponentName: string) => {
        const response = await createOpponentRequest(dispatch, { opponentName });
        const { id } = response;
        props.onSelect?.({ id, name: opponentName });
    };

    const onSelect = (a: ValueType<any>) => {
        props.onSelect?.(a.value);
    };

    const options = opponents
        .filter(op => !props.alreadyUsedOpponents?.has(op.id))
        .map(op => ({ label: op.name, value: op }));

    return <Dropdown options={options} {...props} onSelect={onSelect} onCreateOption={createOpponent} />;
};

export default OpponentsDropdown;
