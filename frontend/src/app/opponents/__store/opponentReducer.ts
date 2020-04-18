import { Opponent, OpponentListItem, SingleOpponentStats } from "app/opponents/__models/OpponentModels";
import { createReducer } from "@reduxjs/toolkit";

export interface OpponentStore {
    list: OpponentListItem[];
    single?: {
        opponent: Opponent;
        stats: SingleOpponentStats;
    };
}

const initialState: OpponentStore = {
    list: [],
};

export const opponentReducer = createReducer<OpponentStore>(initialState, {
    APP_INITIALIZED: state => ({
        ...state,
        list: [
            {
                id: -1,
                name: "grudus",
                lastPlayedBoardGame: "Carcassone",
                numberOfPlays: 240,
                numberOfWins: 238,
            },
            {
                id: 0,
                name: "madzia",
                lastPlayedBoardGame: "Carcassone",
                numberOfPlays: 240,
                numberOfWins: 2,
            },
            {
                id: 1,
                name: "bolec",
                lastPlayedBoardGame: "Wsiąść do pociągu byle jakiego",
                numberOfPlays: 7,
                numberOfWins: 3,
            },
            {
                id: 2,
                name: "Marcin Grzegorz Karwat syn Grzegorza i Lidii",
                numberOfPlays: 0,
                numberOfWins: 0,
            },
        ],
        single: {
            opponent: {
                id: 2,
                name: "Madzia",
                existingUserName: "maddie",
            },
            stats: {
                numberOfPlays: 254,
                numberOfWins: 133,
                lastPlayedBoardGame: "Osadnicy z Katanu",
                mostPlayedBoardGame: {
                    name: "Carcassone",
                    plays: 31,
                },
                mostWinsBoardGame: {
                    name: "Dobble",
                    wins: 23,
                },
            },
        },
    }),
});
