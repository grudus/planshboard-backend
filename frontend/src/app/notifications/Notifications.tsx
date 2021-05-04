import React, { useState } from "react";
import { useRedux } from "store/rootReducer";
import css from "./notifications.module.scss";
import Button from "library/button/Button";
import { useDateTime } from "app/shared/hooks/useDateTime";
import NotificationMenu from "./menu/NotificationMenu";
import { cssIf, merge } from "utils/cssUtils";
import { useHttpDispatch } from "app/shared/store/httpRequestActions";
import { loadMoreNotificationsRequest, markAllAsReadRequest } from "app/notifications/NotificationApi";
import useTranslations from "app/locale/__hooks/useTranslations";
import { getNotificationEntry, NotificationEntry } from "app/notifications/NotificationTypesFactory";

const Notifications: React.FC = () => {
    const notifications = useRedux(state => state.notification.list);
    const { translate } = useTranslations();
    const { formatTime, getUtcDate } = useDateTime();
    const dispatch = useHttpDispatch();
    const [loading, setLoading] = useState(false);

    if (!notifications?.length) {
        return <p>TODO: Empty state</p>;
    }

    const markAllAsRead = async () => {
        setLoading(true);
        await markAllAsReadRequest(dispatch);
        setLoading(false);
    };

    const loadMore = async () => {
        setLoading(true);
        const lastVisibleDate = notifications[notifications.length - 1].createdAt;
        await loadMoreNotificationsRequest(dispatch, { count: 10, dateToLookAfter: getUtcDate(lastVisibleDate) });
        setLoading(false);
    };

    return (
        <section className={css.wrapper}>
            <Button
                text={translate("NOTIFICATIONS.MARK_ALL_AS_READ")}
                decoration="outlined"
                loading={loading}
                className={css.markAsReadButton}
                onClick={markAllAsRead}
            />
            <ul className={css.notificationList}>
                {notifications.map(notification => {
                    const notificationEntry: NotificationEntry = getNotificationEntry(notification);

                    return (
                        <li
                            key={notification.id}
                            className={merge(css.singleNotification, cssIf(css.notSeen, !notification.displayedAt))}
                        >
                            <notificationEntry.component data={notification.eventData} notification={notification} />
                            <span className={css.notificationDate}>{formatTime(notification.createdAt)}</span>
                            <NotificationMenu
                                actionsDescriptor={notificationEntry.actionsDescriptor}
                                notification={notification}
                            />
                        </li>
                    );
                })}
            </ul>

            <Button text={translate("SHOW_MORE")} decoration="outlined" loading={loading} onClick={loadMore} />
        </section>
    );
};

export default Notifications;
