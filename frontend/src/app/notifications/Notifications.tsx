import React from "react";
import { useRedux } from "store/rootReducer";
import css from "./notifications.module.scss";
import Button from "library/button/Button";
import { useDateTime } from "app/shared/hooks/useDateTime";
import IconButton from "library/icon-button/IconButton";
import Icons from "library/icons/Icons";
import { getNotificationByType } from "./NotificationTypesFactory";

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

    const commonActions = ["DELETE", "MARK_AS_READ"];

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

                    const action = [...commonActions, ...notificationEntry.extraActions];
                    return (
                        <li key={notification.id} className={css.singleNotification}>
                            <notificationEntry.component data={notification.eventData} />
                            <span className={css.notificationDate}>{formatTime(notification.createdAt)}</span>
                            <IconButton svgIcon={Icons.MoreVertical} onClick={() => alert(JSON.stringify(action))} />
                        </li>
                    );
                })}
            </ul>
        </section>
    );
};

export default Notifications;
