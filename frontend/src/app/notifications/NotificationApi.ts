import { ApiCall } from "app/shared/store/httpRequestActions";
import { apiRoutes } from "app/routing/routes";
import {
    AcceptOpponentLinkedNotificationRequest,
    AcceptPlayNotificationRequest,
    LoadMoreRequest,
    MarkAsReadRequest,
} from "app/notifications/__models/NotificationApiModels";
import { IdRequest } from "app/shared/models/Response";

const markAsRead: ApiCall<MarkAsReadRequest> = request => ({
    type: "put",
    path: apiRoutes.notifications.markAsRead,
    body: request,
});

const markAllAsRead: ApiCall = () => ({
    type: "put",
    path: apiRoutes.notifications.markAllAsRead,
});

const deleteNotification: ApiCall<IdRequest> = request => ({
    type: "delete",
    path: apiRoutes.notifications.delete(request.id),
});

const loadMore: ApiCall<LoadMoreRequest> = request => ({
    type: "get",
    path: apiRoutes.notifications.paginated(request.count, request.dateToLookAfter),
});

const acceptPlay: ApiCall<AcceptPlayNotificationRequest> = request => ({
    type: "post",
    path: apiRoutes.playNotifications.accept,
    body: request,
});

const acceptOpponentLinked: ApiCall<AcceptOpponentLinkedNotificationRequest> = request => ({
    type: "post",
    path: apiRoutes.opponentNotifications.accept,
    body: request,
});

const fetchInitial: ApiCall = () => ({
    type: "get",
    path: apiRoutes.notifications.paginated(10),
});

const NotificationApi = {
    markAsRead,
    markAllAsRead,
    deleteNotification,
    loadMore,
    acceptPlay,
    acceptOpponentLinked,
    fetchInitial,
};

export default NotificationApi;
