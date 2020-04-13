import { Opponent } from "app/opponents/__models/OpponentModels";
import { createReducer } from "@reduxjs/toolkit";

export interface OpponentStore {
    list: Opponent[];
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
            },
            {
                id: 0,
                name: "madzia",
            },
            {
                id: 1,
                name: "bolec",
            },
            {
                id: 2,
                name: "kamrat",
            },
        ],
    }),
});
