export interface Opponent {
    id: number;
    name: string;
    existingUserName?: string;
}

export interface OpponentListItem extends Opponent {
    numberOfPlays: number;
    numberOfWins: number;
    lastPlayedBoardGame?: string;
}

export interface SingleOpponentStats {
    numberOfPlays: number;
    numberOfWins: number;

    lastPlayedBoardGame?: string;
    mostPlayedBoardGame?: {
        name: string;
        plays: number;
    };
    mostWinsBoardGame?: {
        name: string;
        wins: number;
    };
}

export interface CreateOpponentRequest {
    opponentName: string;
    existingUserName: string;
}
