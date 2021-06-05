import React from "react";
import css from "./accept-invitation.module.scss";
import useTranslations from "app/locale/__hooks/useTranslations";
import Heading from "library/text/Heading";

export interface AcceptInvitationDescriptionProps {
    creatorDisplayName: string;
}

const AcceptInvitationDescription: React.FC<AcceptInvitationDescriptionProps> = props => {
    const { translate } = useTranslations();

    return (
        <div className={css.description}>
            <Heading
                variant="h4"
                className={css.mainText}
                text={translate("NOTIFICATIONS.ACCEPT_LINKED.TITLE").replace("{{name}}", props.creatorDisplayName)}
            />
            <p className={css.subText}>{translate("NOTIFICATIONS.ACCEPT_LINKED.DESCRIPTION")}</p>
        </div>
    );
};

export default React.memo(AcceptInvitationDescription);
