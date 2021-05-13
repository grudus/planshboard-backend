import React from "react";
import css from "./accept-invitation.module.scss";
import MediumTitle from "library/text/MediumTitle";
import useTranslations from "app/locale/__hooks/useTranslations";

export interface AcceptInvitationDescriptionProps {
    creatorDisplayName: string;
}

const AcceptInvitationDescription: React.FC<AcceptInvitationDescriptionProps> = props => {
    const { translate } = useTranslations();

    return (
        <div className={css.description}>
            <MediumTitle className={css.mainText}>
                {translate("NOTIFICATIONS.ACCEPT_LINKED.TITLE").replace("{{name}}", props.creatorDisplayName)}
            </MediumTitle>
            <p className={css.subText}>{translate("NOTIFICATIONS.ACCEPT_LINKED.DESCRIPTION")}</p>
        </div>
    );
};

export default React.memo(AcceptInvitationDescription);
