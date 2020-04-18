import {
    Opponent,
    OpponentListItem,
    OpponentWithStats,
    SingleOpponentStats,
} from "app/opponents/__models/OpponentModels";
import { createReducer, PayloadAction } from "@reduxjs/toolkit";
import { getAllOpponentsSuccessAction, getSingleOpponentSuccessAction } from "app/opponents/__store/opponentActions";

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
    [getSingleOpponentSuccessAction.type]: (state, action: PayloadAction<OpponentWithStats>) => ({
        ...state,
        single: action.payload,
    }),
});
