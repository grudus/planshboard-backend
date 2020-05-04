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
    currentUser?: Opponent;
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
        currentUser: action.payload.find(op => op.linkedUser?.status === "LINKED_WITH_CREATOR"),
    }),
    [getSingleOpponentSuccessAction.type]: (state, action: PayloadAction<OpponentWithStats>) => ({
        ...state,
        single: action.payload,
    }),
    APP_INITIALIZED: state => ({
        ...state,
        currentUser: {
            id: 1,
            name: "grudus",
            linkedUser: { status: "LINKED_WITH_CREATOR", userId: 1, userName: "grudus" },
        },
    }),
});
