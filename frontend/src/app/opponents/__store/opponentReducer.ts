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
    APP_INITIALIZED: state => ({
        ...state,
        currentUser: {
            id: 1,
            name: "grudus",
            linkedUser: { status: "LINKED_WITH_CREATOR", userId: 1, userName: "grudus" },
        },
        frequentOpponents: [
            { id: 3, name: "kamrat" },
            { id: 4, name: "bolec", linkedUser: { status: "ENABLED", userId: 3, userName: "boltzman" } },
            { id: 5, name: "ramzes" },
            { id: 6, name: "długie imie po co w ogóle takie wymyślać dla kogoś" },
            { id: 7, name: "Cezary Cezary" },
            { id: 8, name: "Mama Madzi" },
            { id: 2, name: "madzia", linkedUser: { status: "ENABLED", userId: 2, userName: "maddie" } },
        ],
    }),
});
