import React from "react";
import { useRedux } from "store/rootReducer";
import css from "./notifications.module.scss";
import Button from "library/button/Button";
import { useDateTime } from "app/shared/hooks/useDateTime";
import { getNotificationByType } from "./NotificationTypesFactory";
import NotificationMenu from "./menu/NotificationMenu";

// TODO add translations
const Notifications: React.FC = () => {
    const notifications = useRedux(state => state.notification.list);
    const { formatTime } = useDateTime();

    if (!notifications?.length) {
        return <p>Brak notyfikacji</p>;
    }

    const markAllAsRead = () => {
        alert("Mark all as read");
    };

    return (
        <section className={css.wrapper}>
            <Button
                text="Oznacz wszystkie jako przeczytane"
                decoration="outlined"
                className={css.markAsReadButton}
                onClick={markAllAsRead}
            />
            <ul className={css.notificationList}>
                {notifications.map(notification => {
                    const notificationEntry = getNotificationByType(notification.eventType);

                    return (
                        <li key={notification.id} className={css.singleNotification}>
                            <notificationEntry.component data={notification.eventData} />
                            <span className={css.notificationDate}>{formatTime(notification.createdAt)}</span>
                            <NotificationMenu extraActions={notificationEntry.extraActions} />
                        </li>
                    );
                })}
            </ul>
        </section>
    );
};

export default Notifications;
