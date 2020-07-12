export interface BoardGameListItem {
    id: number;
    name: string;
    creatorId?: number;
    createdAt: Date;
}

export interface BasicBoardGame {
    id: number;
    name: string;
}

export interface BoardGamePlayResultsOptions {
    showPosition: boolean;
    showPoints: boolean;
    type: "COOPERATIVE" | "REGULAR";
    showNote: boolean;
    showDate: boolean;
    showTags: boolean;
}

export const defaultBoardGamePlayResultsOptions: BoardGamePlayResultsOptions = {
    showPoints: true,
    showPosition: true,
    type: "REGULAR",
    showNote: true,
    showDate: true,
    showTags: true,
};
