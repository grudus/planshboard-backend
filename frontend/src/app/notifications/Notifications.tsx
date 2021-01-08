import React from "react";
import { useRedux } from "store/rootReducer";

const Notifications: React.FC = () => {
    const notifications = useRedux(state => state.notification.list);

    console.log("NOTIFICATIONS component ", notifications);

    if (!notifications?.length) {
        return <p>Brak notyfikacji</p>;
    }

    return (
        <ul>
            {notifications.map(notification => (
                <li key={notification.id}>
                    <span>
                        {notification.id} {JSON.stringify(notification.eventData, null, 2)}
                    </span>
                </li>
            ))}
        </ul>
    );
};

export default Notifications;
