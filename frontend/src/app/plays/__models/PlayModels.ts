import { Opponent } from "app/opponents/__models/OpponentModels";

export interface PlayResultRow {
    opponent: Opponent;
    position?: number;
    points?: number;
}

export interface PlayMeta {
    note?: string;
    tags?: string[];
    date?: Date;
}

export interface PlayResult {
    opponentId: number;
    points?: number;
    position?: number;
}

export interface SavePlayRequest {
    boardGameId: number;
    results: ReadonlyArray<PlayResult>;
    tags: ReadonlyArray<string>;
    date?: Date;
    note?: string;
}
