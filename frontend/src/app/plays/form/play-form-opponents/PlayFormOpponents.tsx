import React, { useState } from "react";
import { Opponent } from "app/opponents/__models/OpponentModels";
import css from "./play-form-opponents.module.scss";
import Chip from "library/chip/Chip";
import FlipMove from "react-flip-move";
import OpponentsDropdown from "app/opponents/dropdown/OpponentsDropdown";
import { merge } from "utils/cssUtils";
import useTranslations from "app/locale/__hooks/useTranslations";
import Heading from "library/text/Heading";

interface PlayFormOpponentsProps {
    frequentOpponents: Opponent[];
    onSelect: (op: Opponent) => void;
    alreadyUsedOpponents: Set<number>;
}

const PlayFormOpponents: React.FC<PlayFormOpponentsProps> = props => {
    const { translate } = useTranslations();
    const [showMoreOpponents, setShowMoreOpponents] = useState(false);

    return (
        <section>
            <div className={merge(css.titleMoreWrapper)}>
                <Heading variant="h6" className={css.title} text="PLAYS.FORM.OPPONENTS.TITLE" />
                <button className={css.more} onClick={() => setShowMoreOpponents(!showMoreOpponents)}>
                    {showMoreOpponents
                        ? translate("PLAYS.FORM.OPPONENTS.LESS")
                        : translate("PLAYS.FORM.OPPONENTS.MORE")}
                </button>
            </div>

            {!showMoreOpponents && (
                <FlipMove typeName="ul" className={css.frequentOpponentsWrapper}>
                    {props.frequentOpponents
                        .filter(op => !props.alreadyUsedOpponents.has(op.id))
                        .map(op => (
                            <li key={op.id}>
                                <Chip text={op.name} onClick={() => props.onSelect(op)} />
                            </li>
                        ))}
                </FlipMove>
            )}

            {showMoreOpponents && (
                <OpponentsDropdown
                    onSelect={props.onSelect}
                    autoFocus
                    openMenuOnFocus
                    opponentFilter={op => !props.alreadyUsedOpponents?.has(op.id)}
                    noOptionsMessage={() => translate("PLAYS.FORM.OPPONENTS.NO_OPTIONS_DROPDOWN")}
                />
            )}
        </section>
    );
};

export default React.memo(PlayFormOpponents);
