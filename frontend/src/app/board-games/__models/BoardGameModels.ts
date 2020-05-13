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
    type: "COOPERATIVE" | "TRADITIONAL";
    showNote: boolean;
    showDate: boolean;
    showTags: boolean;
}

export const defaultBoardGamePlayResultsOptions: BoardGamePlayResultsOptions = {
    showPoints: true,
    showPosition: true,
    type: "TRADITIONAL",
    showNote: true,
    showDate: true,
    showTags: true,
};
