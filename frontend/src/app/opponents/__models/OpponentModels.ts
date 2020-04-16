export interface Opponent {
    id: number;
    name: string;
}

export interface OpponentListItem extends Opponent {
    lastPlayedBoardGame?: string;
    numberOfPlays: number;
    numberOfWins: number;
}

export interface CreateOpponentRequest {
    opponentName: string;
    existingUserName: string;
}
