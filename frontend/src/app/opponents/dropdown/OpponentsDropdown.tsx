import React, { useState } from "react";
import { useRedux } from "store/rootReducer";
import Dropdown, { DropdownProps } from "library/dropdown/Dropdown";
import { ValueType } from "react-select";
import { Opponent } from "app/opponents/__models/OpponentModels";
import { useAppDispatch } from "store/useAppDispatch";
import OpponentActions from "app/opponents/__store/opponentActions";

interface OpponentsDropdownProps extends Partial<DropdownProps<any>> {
    opponentFilter: (opponent: Opponent) => boolean;
}

const OpponentsDropdown: React.FC<OpponentsDropdownProps> = props => {
    const [isCreatingNew, setCreatingNew] = useState(false);
    const opponents = useRedux(state => state.opponent.list);
    const dispatch = useAppDispatch();

    const createOpponent = async (opponentName: string) => {
        setCreatingNew(true);
        const response = await dispatch(OpponentActions.createOpponent({ opponentName }));
        setCreatingNew(false);
        const { id } = response;
        props.onSelect?.({ id, name: opponentName });
    };

    const onSelect = (a: ValueType<any, false>) => {
        props.onSelect?.(a.value);
    };

    const options = opponents.filter(props.opponentFilter).map(op => ({ label: op.name, value: op }));

    return (
        <Dropdown
            options={options}
            {...props}
            onSelect={onSelect}
            onCreateOption={createOpponent}
            isLoading={isCreatingNew}
        />
    );
};

export default OpponentsDropdown;
