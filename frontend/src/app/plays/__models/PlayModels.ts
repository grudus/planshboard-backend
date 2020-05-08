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
