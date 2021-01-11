import React from "react";
import { useRedux } from "store/rootReducer";
import { NotificationEventType } from "app/notifications/__models/NotificationModels";
import PlayAddedNotification from "app/notifications/types/PlayAddedNotification";
import css from "./notifications.module.scss";
import Button from "library/button/Button";
import { useDateTime } from "app/shared/hooks/useDateTime";
import IconButton from "library/icon-button/IconButton";
import Icons from "library/icons/Icons";

const notificationTypesFactory: Map<NotificationEventType, React.ComponentType<any>> = new Map([
    ["PLAY_ADDED", PlayAddedNotification],
]);

// TODO add translations
const Notifications: React.FC = () => {
    const notifications = useRedux(state => state.notification.list);
    const { formatTime } = useDateTime();

    console.log("NOTIFICATIONS component ", notifications);

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
                    // TODO handle unknown event type
                    const NotificationComponent = notificationTypesFactory.get(notification.eventType)!!;
                    return (
                        <li key={notification.id} className={css.singleNotification}>
                            <NotificationComponent data={notification.eventData} />
                            <span className={css.notificationDate}>{formatTime(notification.createdAt)}</span>
                            <IconButton svgIcon={Icons.MoreVertical} onClick={console.log} />
                        </li>
                    );
                })}
            </ul>
        </section>
    );
};

export default Notifications;
