import { createAction } from "@reduxjs/toolkit";
import { NotificationItem } from "../__models/NotificationModels";

export const fetchInitialNotificationsSuccess = createAction<NotificationItem[]>("GET_NOTIFICATIONS_SUCCESS");
