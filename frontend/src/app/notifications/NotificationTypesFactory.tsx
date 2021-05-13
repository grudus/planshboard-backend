import React, { ReactElement } from "react";
import { NotificationEventType, NotificationItem } from "app/notifications/__models/NotificationModels";
import PlayAddedNotification from "app/notifications/types/PlayAddedNotification";
import UnknownNotification from "app/notifications/types/UnknownNotification";
import Icons from "library/icons/Icons";
import { HttpDispatch } from "app/shared/store/httpRequestActions";
import { acceptPlayNotification } from "app/notifications/NotificationApi";
import OpponentLinkedNotification from "app/notifications/types/OpponentLinkedNotification";
import { DialogContextProps } from "library/dialog/context/DialogContext";
import AcceptInvitationDialog from "app/opponents/accept-invitation/AcceptInvitationDialog";

export interface NotificationActionsDescriptor {
    translateBase: string;
    actions: NotificationAction[];
}

export interface NotificationAction {
    key: string;
    svgIcon?: ReactElement;
    clickAction?: (
        notification: NotificationItem,
        dispatch: HttpDispatch,
        dialogContext: DialogContextProps,
    ) => Promise<any>;
}

export interface NotificationEntry {
    component: React.ComponentType<any>;
    actionsDescriptor: NotificationActionsDescriptor;
}

const notificationEntryByType: Map<NotificationEventType, NotificationEntry> = new Map([
    [
        "PLAY_ADDED",
        {
            component: PlayAddedNotification,
            actionsDescriptor: {
                translateBase: "NOTIFICATIONS.PLAY_ADDED",
                actions: [
                    {
                        key: "ACCEPT",
                        svgIcon: Icons.CheckIcon,
                        clickAction: (notification: NotificationItem, dispatch: HttpDispatch) =>
                            acceptPlayNotification(dispatch, { notificationId: notification.id }),
                    },
                    { key: "ACCEPT_ALL", svgIcon: Icons.CheckDouble },
                    { key: "REJECT", svgIcon: Icons.XIcon },
                ],
            },
        },
    ],
    [
        "OPPONENT_LINKED",
        {
            component: OpponentLinkedNotification,
            actionsDescriptor: {
                translateBase: "NOTIFICATIONS.OPPONENT_LINKED",
                actions: [
                    {
                        key: "ACCEPT",
                        svgIcon: Icons.CheckIcon,
                        clickAction: (
                            notification: NotificationItem,
                            dispatch: HttpDispatch,
                            dialogContext: DialogContextProps,
                        ) => dialogContext.showDialog(<AcceptInvitationDialog notification={notification} />),
                    },
                ],
            },
        },
    ],
]);

const unknownNotification: NotificationEntry = {
    actionsDescriptor: { translateBase: "", actions: [] },
    component: UnknownNotification,
};

export const getNotificationEntry = (notification: NotificationItem): NotificationEntry => {
    const entry = notificationEntryByType.get(notification.eventType) || unknownNotification;

    const possibleActions = entry.actionsDescriptor.actions.filter(({ key }) =>
        notification.possibleActions.includes(key),
    );
    return { ...entry, actionsDescriptor: { ...entry.actionsDescriptor, actions: possibleActions } };
};
