import { OpponentListItem } from "app/opponents/__models/OpponentModels";
import { createReducer } from "@reduxjs/toolkit";

export interface OpponentStore {
    list: OpponentListItem[];
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
    }),
});
