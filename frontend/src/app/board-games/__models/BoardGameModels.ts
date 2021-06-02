import { Opponent } from "app/opponents/__models/OpponentModels";

export interface BoardGame {
    id: number;
    name: string;
    creatorId?: number;
    createdAt: Date;
}

export interface LinkedBoardGame {
    creatorBoardGame: BoardGame;
    creator: Opponent;
    hidden: boolean;
    mergedBoardGameId?: number;
}

export interface SingleBoardGame {
    boardGame: BoardGame;
    options: BoardGamePlayResultsOptions;
}

export enum BoardGameType {
    REGULAR = "REGULAR",
    COOPERATIVE = "COOPERATIVE",
}

export interface BoardGamePlayResultsOptions {
    showPosition: boolean;
    showPoints: boolean;
    gameType: BoardGameType;
    showNote: boolean;
    showDate: boolean;
    showTags: boolean;
    isDefault?: boolean;
}

export const defaultRegularGameOptions: BoardGamePlayResultsOptions = {
    showPoints: true,
    showPosition: true,
    gameType: BoardGameType.REGULAR,
    showNote: true,
    showDate: true,
    showTags: true,
    isDefault: true,
};

export const defaultCooperativeGameOptions: BoardGamePlayResultsOptions = {
    showPoints: false,
    showPosition: false,
    gameType: BoardGameType.COOPERATIVE,
    showNote: true,
    showDate: true,
    showTags: true,
    isDefault: true,
};

export const defaultGameOptions = new Map<BoardGameType, BoardGamePlayResultsOptions>([
    [BoardGameType.REGULAR, defaultRegularGameOptions],
    [BoardGameType.COOPERATIVE, defaultCooperativeGameOptions],
]);
