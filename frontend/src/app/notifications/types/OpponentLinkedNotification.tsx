import React from "react";
import { NotificationItem, OpponentNotification } from "app/notifications/__models/NotificationModels";
import BaseNotificationWrapper from "app/notifications/types/BaseNotificationWrapper";
import css from "./notification-types.module.scss";
import useTranslations from "app/locale/__hooks/useTranslations";

export interface OpponentLinkedNotificationProps {
    data: OpponentNotification;
    notification: NotificationItem;
}

const OpponentLinkedNotification: React.FC<OpponentLinkedNotificationProps> = props => {
    const { translate } = useTranslations();

    return (
        <BaseNotificationWrapper notification={props.notification} creatorName={props.data.creatorDisplayName}>
            <h5 className={css.title}>{translate("NOTIFICATIONS.OPPONENT_LINKED.TITLE")}.</h5>
            <span className={css.metaInfo}>{translate("NOTIFICATIONS.OPPONENT_LINKED.META_INFO")}.</span>
        </BaseNotificationWrapper>
    );
};

export default OpponentLinkedNotification;
