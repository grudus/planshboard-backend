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
        list: [
            { numberOfPlays: 0, numberOfWins: 0, id: 3, name: "kamrat" },
            {
                numberOfPlays: 0,
                numberOfWins: 0,
                id: 4,
                name: "bolec",
                linkedUser: { status: "ENABLED", userId: 3, userName: "boltzman" },
            },
            { numberOfPlays: 0, numberOfWins: 0, id: 5, name: "ramzes" },
            { numberOfPlays: 0, numberOfWins: 0, id: 6, name: "długie imie po co w ogóle takie wymyślać dla kogoś" },
            { numberOfPlays: 0, numberOfWins: 0, id: 7, name: "Cezary Cezary" },
            { numberOfPlays: 0, numberOfWins: 0, id: 8, name: "Mama Madzi" },
            {
                numberOfPlays: 0,
                numberOfWins: 0,
                id: 2,
                name: "madzia",
                linkedUser: { status: "ENABLED", userId: 2, userName: "maddie" },
            },
        ],
    }),
});
