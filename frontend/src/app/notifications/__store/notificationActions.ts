import { createAction } from "@reduxjs/toolkit";
import { NotificationItem } from "../__models/NotificationModels";

export const fetchInitialNotificationsSuccess = createAction<NotificationItem[]>("GET_NOTIFICATIONS_SUCCESS");
export const markAsReadSuccess = createAction<number[]>("MARK_AS_READ_SUCCESS");
export const markAllAsReadSuccess = createAction("MARK_ALL_AS_READ_SUCCESS");
export const deleteNotificationSuccess = createAction<number>("DELETE_NOTIFICATION_SUCCESS");
export const loadMoreNotificationsSuccess = createAction<NotificationItem[]>("LOAD_MORE_NOTIFICATIONS_SUCCESS");
export const acceptPlayNotificationSuccess = createAction<number>("ACCEPT_PLAY_NOTIFICATIONS_SUCCESS");
export const acceptOpponentLinkedNotificationSuccess = createAction<NotificationItem>(
    "ACCEPT_OPPONENT_LINKED_NOTIFICATIONS_SUCCESS",
);
