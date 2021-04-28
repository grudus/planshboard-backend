import React from "react";
import { NotificationItem, PlayNotification } from "app/notifications/__models/NotificationModels";
import css from "./notification-types.module.scss";
import useTranslations from "app/locale/__hooks/useTranslations";
import BaseNotificationWrapper from "app/notifications/types/BaseNotificationWrapper";

export interface PlayAddedNotificationProps {
    data: PlayNotification;
    notification: NotificationItem;
}

const PlayAddedNotification: React.FC<PlayAddedNotificationProps> = props => {
    const { translate } = useTranslations();

    const MetaInfo = (
        <>
            {props.data.position !== null && (
                <span>
                    {translate("NOTIFICATIONS.PLAY_ADDED.POSITION")} {props.data.position}.{" "}
                </span>
            )}
            {props.data.points !== null && (
                <span>
                    {translate("NOTIFICATIONS.PLAY_ADDED.POINTS")} {props.data.points}.{" "}
                </span>
            )}
        </>
    );

    return (
        <BaseNotificationWrapper notification={props.notification} creatorName={props.data.creatorDisplayName}>
            <h5 className={css.title}>{translate("NOTIFICATIONS.PLAY_ADDED.TITLE")}</h5>
            <span className={css.metaInfo}>{MetaInfo}</span>
        </BaseNotificationWrapper>
    );
};

export default PlayAddedNotification;
