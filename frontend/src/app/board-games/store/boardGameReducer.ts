import { createReducer, PayloadAction } from "@reduxjs/toolkit";
import { BasicBoardGame, BoardGameListItem } from "app/board-games/models/BoardGameModels";
import { addBoardGameSuccessAction, getBoardGamesSuccessAction } from "app/board-games/store/boardGameActions";

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
    [addBoardGameSuccessAction.type]: (state, action: PayloadAction<BasicBoardGame>) => ({
        ...state,
        list: [...state.list, { ...action.payload, createdAt: new Date() }],
    }),
});
