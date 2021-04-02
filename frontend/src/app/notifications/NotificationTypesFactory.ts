import React, { ReactElement } from "react";
import { NotificationEventType, NotificationItem } from "app/notifications/__models/NotificationModels";
import PlayAddedNotification from "app/notifications/types/PlayAddedNotification";
import UnknownNotification from "app/notifications/types/UnknownNotification";
import Icons from "library/icons/Icons";
import { HttpDispatch } from "app/shared/store/httpRequestActions";
import { acceptPlayNotification } from "app/notifications/NotificationApi";

export interface NotificationAction {
    translateKey: string;
    svgIcon?: ReactElement;
    clickAction?: Function;
}

export interface NotificationEntry {
    component: React.ComponentType<any>;
    extraActions: NotificationAction[];
}

const notificationEntryByType: Map<NotificationEventType, NotificationEntry> = new Map([
    [
        "PLAY_ADDED",
        {
            component: PlayAddedNotification,
            extraActions: [
                {
                    translateKey: "NOTIFICATIONS.PLAY_ADDED.ACCEPT",
                    svgIcon: Icons.CheckIcon,
                    clickAction: (notification: NotificationItem, dispatch: HttpDispatch) =>
                        acceptPlayNotification(dispatch, { notificationId: notification.id }),
                },
                { translateKey: "NOTIFICATIONS.PLAY_ADDED.ACCEPT_ALL", svgIcon: Icons.CheckDouble },
                { translateKey: "NOTIFICATIONS.PLAY_ADDED.REJECT", svgIcon: Icons.XIcon },
            ],
        },
    ],
]);

const unknownNotification = { extraActions: [], component: UnknownNotification };

export const getNotificationByType = (type: NotificationEventType): NotificationEntry =>
    notificationEntryByType.get(type) || unknownNotification;
