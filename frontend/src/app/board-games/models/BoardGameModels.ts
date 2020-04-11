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
