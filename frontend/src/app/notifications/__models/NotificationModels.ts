export type NotificationEventType = "PLAY_ADDED" | "PLAY_EDITED" | "PLAY_DELETED" | "OPPONENT_LINKED";

export interface NotificationItem<T = any> {
    id: number;
    displayUserId: number;
    createdAt: string;
    displayedAt?: string;
    eventType: NotificationEventType;
    eventData: T;
    possibleActions: string[];
}

export interface PlayNotification {
    creatorId: number;
    creatorDisplayName: string;
    playId: number;
    boardGameId: number;
    position?: number;
    points?: number;
}

export interface OpponentNotification {
    creatorId: number;
    creatorDisplayName: string;
    linkedOpponentId: number;
}
