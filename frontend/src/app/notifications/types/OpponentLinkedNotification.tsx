import React from "react";
import { NotificationItem, OpponentNotification } from "app/notifications/__models/NotificationModels";
import BaseNotificationWrapper from "app/notifications/types/BaseNotificationWrapper";
import css from "./notification-types.module.scss";
import useTranslations from "app/locale/__hooks/useTranslations";
import Heading from "library/text/Heading";

export interface OpponentLinkedNotificationProps {
    data: OpponentNotification;
    notification: NotificationItem;
}

const OpponentLinkedNotification: React.FC<OpponentLinkedNotificationProps> = props => {
    const { translate } = useTranslations();

    return (
        <BaseNotificationWrapper notification={props.notification} creatorName={props.data.creatorDisplayName}>
            <Heading variant="h4" text="NOTIFICATIONS.OPPONENT_LINKED.TITLE" className={css.title} />
            <span className={css.metaInfo}>{translate("NOTIFICATIONS.OPPONENT_LINKED.META_INFO")}.</span>
        </BaseNotificationWrapper>
    );
};

export default OpponentLinkedNotification;
