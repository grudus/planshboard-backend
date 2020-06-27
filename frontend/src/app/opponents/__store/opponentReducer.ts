import {
    Opponent,
    OpponentListItem,
    OpponentWithStats,
    SingleOpponentStats,
} from "app/opponents/__models/OpponentModels";
import { createReducer, PayloadAction } from "@reduxjs/toolkit";
import {
    createOpponentSuccessAction,
    getAllOpponentsSuccessAction,
    getFrequentOpponentsSuccessAction,
    getSingleOpponentSuccessAction,
} from "app/opponents/__store/opponentActions";

export interface OpponentStore {
    list: OpponentListItem[];
    currentUser?: Opponent;
    single?: {
        opponent: Opponent;
        stats: SingleOpponentStats;
    };
    frequentOpponents: Opponent[];
}

const initialState: OpponentStore = {
    list: [],
    frequentOpponents: [],
};

export const opponentReducer = createReducer<OpponentStore>(initialState, {
    [getAllOpponentsSuccessAction.type]: (state, action: PayloadAction<OpponentListItem[]>) => ({
        ...state,
        list: action.payload,
        currentUser: action.payload.find(op => op.linkedUser?.status === "LINKED_WITH_CREATOR"),
    }),
    [getSingleOpponentSuccessAction.type]: (state, action: PayloadAction<OpponentWithStats>) => ({
        ...state,
        single: action.payload,
    }),
    [createOpponentSuccessAction.type]: (state, action: PayloadAction<Opponent>) => ({
        ...state,
        list: [...state.list, { ...action.payload, numberOfPlays: 0, numberOfWins: 0 }],
    }),
    [getFrequentOpponentsSuccessAction.type]: (state, action: PayloadAction<Opponent[]>) => ({
        ...state,
        frequentOpponents: action.payload,
    }),
});
