export interface Opponent {
    id: number;
    name: string;
}

export interface OpponentListItem extends Opponent {
    numberOfPlays: number;
    numberOfWins: number;
    lastPlayedBoardGame?: string;
    existingUserName?: string;
}

export type SingleOpponentStats = OpponentListItem;

export interface CreateOpponentRequest {
    opponentName: string;
    existingUserName: string;
}
