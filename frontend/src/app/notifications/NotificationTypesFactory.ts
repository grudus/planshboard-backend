import React from "react";
import { NotificationEventType } from "app/notifications/__models/NotificationModels";
import PlayAddedNotification from "app/notifications/types/PlayAddedNotification";
import UnknownNotification from "app/notifications/types/UnknownNotification";

export interface NotificationEntry {
    component: React.ComponentType<any>;
    extraActions: string[];
}

const notificationEntryByType: Map<NotificationEventType, NotificationEntry> = new Map([
    ["PLAY_ADDED", { component: PlayAddedNotification, extraActions: ["ACCEPT", "REJECT"] }],
]);

const unknownNotification = { extraActions: [], component: UnknownNotification };

export const getNotificationByType = (type: NotificationEventType): NotificationEntry =>
    notificationEntryByType.get(type) || unknownNotification;
