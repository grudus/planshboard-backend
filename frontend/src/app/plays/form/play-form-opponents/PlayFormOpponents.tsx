import React, { useState } from "react";
import { Opponent } from "app/opponents/__models/OpponentModels";
import css from "./play-form-opponents.module.scss";
import Chip from "library/chip/Chip";
import FlipMove from "react-flip-move";
import Dropdown from "library/dropdown/Dropdown";

interface PlayFormOpponentsProps {
    frequentOpponents: Opponent[];
    onSelect: (op: Opponent) => void;
}

const PlayFormOpponents: React.FC<PlayFormOpponentsProps> = props => {
    const [options, setOptions] = useState([
        { label: "Mamcia", value: "mama" },
        { label: "Tatcia", value: "tata" },
        { label: "Elżunia", value: "elżunia" },
        { label: "Member One", value: "member" },
    ]);
    const [loading, setLoading] = useState(false);

    const onOpponentSelect = (aaa: any) => {
        console.log("@@@@@@@@@@@@@2", aaa);
    };

    const onCreateOpponent = (name: string) => {
        console.log("$###############", name);
        setLoading(true);
        setTimeout(() => {
            setOptions([...options, { label: name, value: name }]);
            setLoading(false);
        }, 20_000);
    };

    return (
        <section>
            <h6 className={css.title}>Wybierz graczy</h6>
            <FlipMove typeName="ul" className={css.frequentOpponentsWrapper}>
                {props.frequentOpponents.map(op => (
                    <li key={op.id}>
                        <Chip text={op.name} onClick={() => props.onSelect(op)} />
                    </li>
                ))}
                <span className={css.more}>Więcej</span>
            </FlipMove>
            <Dropdown
                options={options}
                onSelect={onOpponentSelect}
                onCreateOption={onCreateOpponent}
                isLoading={loading}
            />
        </section>
    );
};

export default React.memo(PlayFormOpponents);
