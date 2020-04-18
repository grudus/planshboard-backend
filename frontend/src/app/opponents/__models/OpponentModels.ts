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

export interface CreateOpponentRequest {
    opponentName: string;
    existingUserName: string;
}
