import React from "react";
import { NotificationItem } from "app/notifications/__models/NotificationModels";
import BaseNotificationWrapper from "app/notifications/types/BaseNotificationWrapper";

const UnknownNotification: React.FC<{ notification: NotificationItem }> = props => (
    <BaseNotificationWrapper notification={props.notification} creatorName="Error">
        Unknown notification type: &quot;{props.notification.eventType}&quot;
    </BaseNotificationWrapper>
);

export default UnknownNotification;
