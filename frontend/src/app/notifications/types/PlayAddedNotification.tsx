import React from "react";
import { NotificationItem, PlayNotification } from "app/notifications/__models/NotificationModels";
import css from "./notification-types.module.scss";
import Button from "library/button/Button";
import Icons from "library/icons/Icons";
import Avatar from "library/avatar/Avatar";
import { useHttpDispatch } from "app/shared/store/httpRequestActions";
import { acceptPlayNotification } from "app/notifications/NotificationApi";
import useTranslations from "app/locale/__hooks/useTranslations";

export interface PlayAddedNotificationProps {
    data: PlayNotification;
    notification: NotificationItem;
}

const PlayAddedNotification: React.FC<PlayAddedNotificationProps> = props => {
    const dispatch = useHttpDispatch();
    const { translate } = useTranslations();

    const acceptPlay = () => {
        acceptPlayNotification(dispatch, { notificationId: props.notification.id });
    };

    return (
        <div className={css.playAdded}>
            <Avatar
                image={Icons.NoImageUserIcon}
                name={props.data.creatorDisplayName}
                className={css.avatar}
                size={32}
                color="neutral"
            />

            <div className={css.infoActionsWrapper}>
                <div className={css.info}>
                    <span className={css.user}>{props.data.creatorDisplayName}</span>
                    <h5 className={css.title}>{translate("NOTIFICATIONS.PLAY_ADDED.TITLE")}</h5>
                    <div className={css.metaInfo}>
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
                    </div>
                </div>

                <div className={css.actionButtons}>
                    <Button
                        text={translate("NOTIFICATIONS.PLAY_ADDED.ACCEPT")}
                        decoration="outlined"
                        textSize="smallSize"
                        onClick={acceptPlay}
                    />
                </div>
            </div>
        </div>
    );
};

export default PlayAddedNotification;
