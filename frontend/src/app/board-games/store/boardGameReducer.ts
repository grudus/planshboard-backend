import { createReducer, PayloadAction } from "@reduxjs/toolkit";
import { BoardGameListItem } from "app/board-games/models/BoardGameModels";
import { getBoardGamesSuccessAction } from "app/board-games/store/boardGameActions";

export interface BoardGameStore {
    list: BoardGameListItem[];
}

const initialState: BoardGameStore = {
    list: [],
};

export const boardGamesReducer = createReducer<BoardGameStore>(initialState, {
    [getBoardGamesSuccessAction.type]: (state, action: PayloadAction<BoardGameListItem[]>) => ({
        ...state,
        list: action.payload,
    }),
});