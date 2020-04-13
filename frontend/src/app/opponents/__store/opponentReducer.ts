import { Opponent } from "app/opponents/__models/OpponentModels";
import { createReducer, PayloadAction } from "@reduxjs/toolkit";
import { getALlOpponentsSuccessAction } from "app/opponents/__store/opponentActions";

export interface OpponentStore {
    list: Opponent[];
}

const initialState: OpponentStore = {
    list: [
        {
            id: -1,
            name: "ja",
        },
    ],
};

export const opponentReducer = createReducer<OpponentStore>(initialState, {
    [getALlOpponentsSuccessAction.type]: (state, action: PayloadAction<Opponent[]>) => ({
        ...state,
        list: action.payload,
    }),
});
