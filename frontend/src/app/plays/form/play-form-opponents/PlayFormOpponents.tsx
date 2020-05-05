import React, { useState } from "react";
import { Opponent } from "app/opponents/__models/OpponentModels";
import css from "./play-form-opponents.module.scss";
import Chip from "library/chip/Chip";
import FlipMove from "react-flip-move";
import OpponentsDropdown from "app/opponents/dropdown/OpponentsDropdown";
import { cssIf, merge } from "utils/cssUtils";
import useTranslations from "app/locale/__hooks/useTranslations";

interface PlayFormOpponentsProps {
    frequentOpponents: Opponent[];
    onSelect: (op: Opponent) => void;
}

const PlayFormOpponents: React.FC<PlayFormOpponentsProps> = props => {
    const { translate } = useTranslations();
    const [showMoreOpponents, setShowMoreOpponents] = useState(false);

    return (
        <section>
            <div className={merge(css.titleMoreWrapper)}>
                <h6 className={css.title}>{translate("PLAYS.FORM.OPPONENTS.TITLE")}</h6>
                <span className={css.more} onClick={() => setShowMoreOpponents(!showMoreOpponents)}>
                    {showMoreOpponents
                        ? translate("PLAYS.FORM.OPPONENTS.LESS")
                        : translate("PLAYS.FORM.OPPONENTS.MORE")}
                </span>
            </div>

            <FlipMove
                typeName="ul"
                className={merge(css.frequentOpponentsWrapper, cssIf(css.hidden, showMoreOpponents))}
            >
                {props.frequentOpponents.map(op => (
                    <li key={op.id}>
                        <Chip text={op.name} onClick={() => props.onSelect(op)} />
                    </li>
                ))}
            </FlipMove>

            {showMoreOpponents && <OpponentsDropdown onSelect={props.onSelect} autoFocus defaultMenuIsOpen />}
        </section>
    );
};

export default React.memo(PlayFormOpponents);
