import { NotificationItem } from "app/notifications/__models/NotificationModels";
import { createReducer, PayloadAction } from "@reduxjs/toolkit";
import { fetchInitialNotificationsSuccess } from "app/notifications/__store/notificationActions";

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
    }),
});
