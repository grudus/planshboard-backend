import React from "react";
import css from "./linked-user.module.scss";
import Tooltip from "library/tooltip/Tooltip";
import Icons from "library/icons/Icons";
import { Opponent } from "app/opponents/__models/OpponentModels";
import useTranslations from "app/locale/__hooks/useTranslations";

export interface LinkedUserProps {
    opponent?: Opponent;
}

const LinkedUser: React.FC<LinkedUserProps> = props => {
    const { translate } = useTranslations();
    const isCurrentUser = props.opponent?.linkedUser?.status === "LINKED_WITH_CREATOR" ?? false;

    if (!props.opponent?.linkedUser) return <h6 className={css.existingUserName}>&nbsp;</h6>;

    return isCurrentUser ? (
        <div className={css.existingUserWrapper}>
            <span className={css.existingUserName}>{translate("OPPONENTS.PROFILE.LINKED_WITH_CREATOR")}</span>
        </div>
    ) : (
        <div className={css.existingUserWrapper} data-tip={translate("OPPONENTS.WAITING_FOR_CONFIRMATION")}>
            <Tooltip />
            <span className={css.existingUserName}>{props.opponent?.linkedUser?.userName}</span>
            {Icons.AlertIcon}
        </div>
    );
};

export default React.memo(LinkedUser);
