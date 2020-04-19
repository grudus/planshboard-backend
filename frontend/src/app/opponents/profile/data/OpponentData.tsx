import React from "react";
import { Opponent } from "app/opponents/__models/OpponentModels";
import Avatar from "library/avatar/Avatar";
import Icons from "library/icons/Icons";
import css from "./opponent-data.module.scss";

interface OpponentDataProps {
    opponent?: Opponent;
}

const OpponentData: React.FC<OpponentDataProps> = props => {
    return (
        <article className={css.wrapper}>
            <Avatar
                image={Icons.NoImageUserIcon}
                name={props.opponent?.name ?? ""}
                className={css.avatar}
                size={64}
                color="accent"
            />
            <div className={css.namesWrapper}>
                <h4 className={css.opponentName}>{props.opponent?.name}</h4>
                <h6 className={css.existingUserName}>{props.opponent?.linkedUser?.userName}</h6>
            </div>
        </article>
    );
};

export default React.memo(OpponentData);
