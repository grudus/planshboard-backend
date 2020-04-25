export type LinkedOpponentStatus = "WAITING_FOR_CONFIRMATION" | "ENABLED" | "DISABLED" | "LINKED_WITH_CREATOR";

export interface UserLinkedToOpponent {
    userId: number;
    userName: string;
    status: LinkedOpponentStatus;
}

export interface Opponent {
    id: number;
    name: string;
    linkedUser?: UserLinkedToOpponent;
}

export interface OpponentListItem extends Opponent {
    numberOfPlays: number;
    numberOfWins: number;
    lastPlayedBoardGame?: string;
}

export interface OpponentWithStats {
    opponent: Opponent;
    stats: SingleOpponentStats;
}

export interface SingleOpponentStats {
    numberOfPlays: number;
    numberOfWins: number;

    lastPlayedBoardGame?: string;
    mostPlayedBoardGame?: {
        name: string;
        count: number;
    };
    mostWinsBoardGame?: {
        name: string;
        count: number;
    };
}

export interface SaveOpponentRequest {
    opponentName: string;
    existingUserName: string;
    id?: number;
}
