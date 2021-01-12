import { NotificationItem } from "app/notifications/__models/NotificationModels";
import { createReducer, PayloadAction } from "@reduxjs/toolkit";
import {
    deleteNotificationSuccess,
    fetchInitialNotificationsSuccess,
    loadMoreNotificationsSuccess,
    markAllAsReadSuccess,
    markAsReadSuccess,
} from "app/notifications/__store/notificationActions";

export interface NotificationStore {
    list: NotificationItem[];
    unreadNotificationsCount: number;
}

const initialState: NotificationStore = {
    list: [],
    unreadNotificationsCount: 0,
};

export const notificationReducer = createReducer<NotificationStore>(initialState, {
    [fetchInitialNotificationsSuccess.type]: (state, action: PayloadAction<NotificationItem[]>) => ({
        ...state,
        list: action.payload,
        unreadNotificationsCount: countUnread(action.payload),
    }),
    [markAsReadSuccess.type]: (state, action: PayloadAction<number[]>) => {
        const list = state.list.map(n =>
            action.payload.includes(n.id) ? { ...n, displayedAt: new Date().toISOString() } : n,
        );
        return { ...state, list, unreadNotificationsCount: countUnread(list) };
    },
    [markAllAsReadSuccess.type]: state => {
        const list = state.list.map(n => (!n.displayedAt ? { ...n, displayedAt: new Date().toISOString() } : n));
        return { ...state, list, unreadNotificationsCount: 0 };
    },
    [deleteNotificationSuccess.type]: (state, action: PayloadAction<number>) => {
        const list = state.list.filter(n => n.id !== action.payload);
        return { ...state, list, unreadNotificationsCount: countUnread(list) };
    },
    [loadMoreNotificationsSuccess.type]: (state, action: PayloadAction<NotificationItem[]>) => {
        const list = [...state.list, ...action.payload];
        return { ...state, list, unreadNotificationsCount: countUnread(list) };
    },
});

const countUnread = (list: NotificationItem[]): number =>
    list.filter(notification => !!notification.displayedAt).length;
