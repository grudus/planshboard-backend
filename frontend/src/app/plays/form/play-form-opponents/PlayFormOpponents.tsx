import React from "react";
import { Opponent } from "app/opponents/__models/OpponentModels";
import css from "./play-form-opponents.module.scss";
import Chip from "library/chip/Chip";
import FlipMove from "react-flip-move";

interface PlayFormOpponentsProps {
    frequentOpponents: Opponent[];
    onSelect: (op: Opponent) => void;
}

const PlayFormOpponents: React.FC<PlayFormOpponentsProps> = props => {
    return (
        <section>
            <h6 className={css.title}>Wybierz graczy</h6>
            <FlipMove typeName="ul" className={css.frequentOpponentsWrapper}>
                {props.frequentOpponents.map(op => (
                    <li key={op.id}>
                        <Chip text={op.name} onClick={() => props.onSelect(op)} />
                    </li>
                ))}
                <span className={css.more}>Pokaż wszystkich</span>
            </FlipMove>
        </section>
    );
};

export default React.memo(PlayFormOpponents);
