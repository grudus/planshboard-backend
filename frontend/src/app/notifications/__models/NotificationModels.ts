export type NotificationEventType = "PLAY_ADDED" | "PLAY_EDITED" | "PLAY_DELETED" | "OPPONENT_LINKED";

export interface NotificationItem<T = any> {
    id: number;
    displayUserId: number;
    createdAt: Date;
    displayedAt?: Date;
    eventType: NotificationEventType;
    eventData: T;
}
