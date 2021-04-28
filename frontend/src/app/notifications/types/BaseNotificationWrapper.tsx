import React from "react";
import css from "app/notifications/types/notification-types.module.scss";
import Avatar from "library/avatar/Avatar";
import Icons from "library/icons/Icons";
import { NotificationItem } from "app/notifications/__models/NotificationModels";

export interface BaseNotificationWrapperProps {
    notification: NotificationItem;
    creatorName: string;
}

const BaseNotificationWrapper: React.FC<BaseNotificationWrapperProps> = props => (
    <article className={css.baseWrapper}>
        <Avatar
            image={Icons.NoImageUserIcon}
            name={props.creatorName}
            className={css.avatar}
            size={32}
            color="neutral"
        />
        <div className={css.content}>
            <span className={css.user}>{props.creatorName}</span>
            <div>{props.children}</div>
        </div>
    </article>
);

export default BaseNotificationWrapper;
