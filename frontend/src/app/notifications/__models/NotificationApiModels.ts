import { SelectedOpponent } from "app/opponents/accept-invitation/AcceptInvitationDialog";

export interface MarkAsReadRequest {
    ids: number[];
}

export interface LoadMoreRequest {
    count: number;
    dateToLookAfter: Date;
}

export interface AcceptPlayNotificationRequest {
    notificationId: number;
}

export interface AcceptOpponentLinkedNotificationRequest {
    notificationId: number;
    opponent: SelectedOpponent;
}
