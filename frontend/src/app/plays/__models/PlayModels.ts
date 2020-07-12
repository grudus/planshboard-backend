import { Opponent } from "app/opponents/__models/OpponentModels";

export interface PlayResultRow {
    opponent: Opponent;
    position?: number;
    points?: number;
}

export enum FinalResult {
    WIN = "WIN",
    DEFEAT = "DEFEAT",
}

export interface PlayMeta {
    note?: string;
    tags?: string[];
    date?: Date;
    finalResult?: FinalResult;
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

export interface PlayListItem {
    id: number;
    boardGameId: number;
}
