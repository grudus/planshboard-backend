import { NotificationItem } from "app/notifications/__models/NotificationModels";
import { createReducer, PayloadAction } from "@reduxjs/toolkit";
import NotificationActions from "app/notifications/__store/notificationActions";

export interface NotificationStore {
    list: NotificationItem[];
    unreadNotificationsCount: number;
}

const initialState: NotificationStore = {
    list: [],
    unreadNotificationsCount: 0,
};

export const notificationReducer = createReducer<NotificationStore>(initialState, {
    [NotificationActions.fetchInitial.fulfilled.type]: (state, action: PayloadAction<NotificationItem[]>) => ({
        ...state,
        list: action.payload,
        unreadNotificationsCount: countUnread(action.payload),
    }),
    [NotificationActions.markAsRead.fulfilled.type]: (state, action: PayloadAction<number[]>) => {
        return markAsRead(state, n => action.payload.includes(n.id));
    },
    [NotificationActions.markAllAsRead.fulfilled.type]: state => {
        return markAsRead(state, n => !n.displayedAt);
    },
    [NotificationActions.acceptPlay.fulfilled.type]: (state, action: PayloadAction<number>) => {
        return markAsRead(state, n => n.id === action.payload);
    },
    [NotificationActions.acceptOpponentLinked.fulfilled.type]: (state, action: PayloadAction<NotificationItem>) => {
        return replaceNotification(
            state,
            notification => notification.id === action.payload.id,
            () => action.payload,
        );
    },
    [NotificationActions.deleteNotification.fulfilled.type]: (state, action: PayloadAction<number>) => {
        const list = state.list.filter(n => n.id !== action.payload);
        return { ...state, list, unreadNotificationsCount: countUnread(list) };
    },
    [NotificationActions.loadMore.fulfilled.type]: (state, action: PayloadAction<NotificationItem[]>) => {
        const list = [...state.list, ...action.payload];
        return { ...state, list, unreadNotificationsCount: countUnread(list) };
    },
});

const markAsRead = (state: NotificationStore, shouldMarkAsRead: (_: NotificationItem) => boolean): NotificationStore =>
    replaceNotification(state, shouldMarkAsRead, notification => ({
        ...notification,
        displayedAt: new Date().toISOString(),
    }));

const replaceNotification = (
    state: NotificationStore,
    filter: (_: NotificationItem) => boolean,
    mapper: (_: NotificationItem) => NotificationItem,
): NotificationStore => {
    const list = state.list.map(item => (filter(item) ? mapper(item) : item));
    return { ...state, list, unreadNotificationsCount: countUnread(list) };
};

const countUnread = (list: NotificationItem[]): number =>
    list.filter(notification => !!notification.displayedAt).length;
