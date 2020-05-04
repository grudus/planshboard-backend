import React, { ChangeEvent } from "react";
import css from "./select-opponent-position.module.scss";
import { cssIf, merge } from "utils/cssUtils";
import { PlayResultRow } from "app/plays/__models/PlayModels";

interface SelectOpponentPositionProps {
    numberOfPositions: number;
    result: PlayResultRow;
    onChange: (result: PlayResultRow) => void;
}

const SelectOpponentPosition: React.FC<SelectOpponentPositionProps> = props => {
    const onChange = (a: ChangeEvent<HTMLInputElement>) => {
        const { value } = a.target;
        const copy = { ...props.result, position: parseInt(value, 10) };
        props.onChange(copy);
    };

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
                            onChange={onChange}
                        />
                    </label>
                );
            })}
        </div>
    );
};

export default React.memo(SelectOpponentPosition);
