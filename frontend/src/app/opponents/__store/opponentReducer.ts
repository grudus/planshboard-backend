import { Opponent, OpponentListItem, SingleOpponentStats } from "app/opponents/__models/OpponentModels";
import { createReducer, PayloadAction } from "@reduxjs/toolkit";
import { getAllOpponentsSuccessAction } from "app/opponents/__store/opponentActions";

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
    [getAllOpponentsSuccessAction.type]: (state, action: PayloadAction<OpponentListItem[]>) => ({
        ...state,
        list: action.payload,
    }),
    APP_INITIALIZED: state => ({
        ...state,
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
