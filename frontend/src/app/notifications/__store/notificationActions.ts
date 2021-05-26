import { NotificationItem } from "../__models/NotificationModels";
import { baseHttpAction } from "app/shared/store/httpRequestActions";
import NotificationApi from "app/notifications/NotificationApi";

const markAsRead = baseHttpAction("MARK_AS_READ", NotificationApi.markAsRead, (_, req) => req.ids);

const markAllAsRead = baseHttpAction<never, void>("MARK_ALL_AS_READ", NotificationApi.markAllAsRead);

const deleteNotification = baseHttpAction(
    "DELETE_NOTIFICATION",
    NotificationApi.deleteNotification,
    (_, req) => req.id,
);

const loadMore = baseHttpAction<NotificationItem[]>("LOAD_MORE_NOTIFICATIONS", NotificationApi.loadMore);

const acceptPlay = baseHttpAction(
    "ACCEPT_PLAY_NOTIFICATIONS",
    NotificationApi.acceptPlay,
    (_, req) => req.notificationId,
);

const acceptOpponentLinked = baseHttpAction<NotificationItem>(
    "ACCEPT_OPPONENT_LINKED_NOTIFICATIONS",
    NotificationApi.acceptOpponentLinked,
);

const fetchInitial = baseHttpAction<NotificationItem[], void>(
    "FETCH_INITIAL_NOTIFICATIONS",
    NotificationApi.fetchInitial,
);

const NotificationActions = {
    markAsRead,
    markAllAsRead,
    deleteNotification,
    loadMore,
    acceptPlay,
    acceptOpponentLinked,
    fetchInitial,
};

export default NotificationActions;
