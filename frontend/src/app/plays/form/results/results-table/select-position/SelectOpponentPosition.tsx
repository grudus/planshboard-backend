import React from "react";
import css from "./select-opponent-position.module.scss";
import { cssIf, merge } from "utils/cssUtils";
import { PlayResultRow } from "app/plays/__models/PlayModels";

interface SelectOpponentPositionProps {
    numberOfPositions: number;
    result: PlayResultRow;
    onChange: (result: PlayResultRow) => void;
}

const SelectOpponentPosition: React.FC<SelectOpponentPositionProps> = props => {
    const onClick = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        const { value } = event.currentTarget;
        const selectedPosition = parseInt(value, 10);
        const currentPosition = props.result.position;
        const newPosition = currentPosition === selectedPosition ? undefined : selectedPosition;

        const copy = { ...props.result, position: newPosition };
        props.onChange(copy);
    };

    const ignoreBecauseOnClickIsUsedToAllowDeselect = () => false;

    return (
        <div className={css.wrapper}>
            {[...Array(props.numberOfPositions).keys()].map((_, index) => {
                const value = index + 1;
                const isSelected = props.result.position === value;
                return (
                    <label key={index} className={merge(css.singlePosition, cssIf(css.selected, isSelected))}>
                        <span>{value}</span>
                        <input
                            checked={isSelected}
                            className={css.radio}
                            type="radio"
                            name={`position-${props.result.opponent.id}`}
                            value={value}
                            onChange={ignoreBecauseOnClickIsUsedToAllowDeselect}
                            onClick={onClick}
                        />
                    </label>
                );
            })}
        </div>
    );
};

export default React.memo(SelectOpponentPosition);
