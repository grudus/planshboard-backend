import React from "react";
import { Opponent } from "app/opponents/__models/OpponentModels";
import Avatar from "library/avatar/Avatar";
import Icons from "library/icons/Icons";
import css from "./opponent-data.module.scss";
import useTranslations from "app/locale/__hooks/useTranslations";

interface OpponentDataProps {
    opponent?: Opponent;
}

const OpponentData: React.FC<OpponentDataProps> = props => {
    const { translate } = useTranslations();
    const isCurrentUser = props.opponent?.linkedUser?.status === "LINKED_WITH_CREATOR" ?? false;

    const linkedUserInfo = () => {
        if (!props.opponent) return;
        return isCurrentUser ? translate("OPPONENTS.PROFILE.LINKED_WITH_CREATOR") : props.opponent.linkedUser?.userName;
    };
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
                <h6 className={css.existingUserName}>{linkedUserInfo()}</h6>
            </div>
        </article>
    );
};

export default React.memo(OpponentData);
