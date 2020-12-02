import { createReducer, PayloadAction } from "@reduxjs/toolkit";
import { BasicBoardGame, BoardGame, SingleBoardGame } from "app/board-games/__models/BoardGameModels";
import {
    addBoardGameSuccessAction,
    deleteBoardGameSuccessAction,
    editBoardGameSuccessAction,
    getBoardGamesSuccessAction,
    getSingleBoardGameSuccessAction,
} from "app/board-games/__store/boardGameActions";
import { AddBoardGameRequest, DeleteBoardGameRequest } from "app/board-games/BoardGameApi";

export interface BoardGameStore {
    list: BoardGame[];
    single?: SingleBoardGame;
    boardGameExists?: boolean;
}

const initialState: BoardGameStore = {
    list: [],
};

export const boardGamesReducer = createReducer<BoardGameStore>(initialState, {
    [getBoardGamesSuccessAction.type]: (state, action: PayloadAction<BoardGame[]>) => ({
        ...state,
        list: action.payload,
        boardGameExists: !!action.payload.length,
    }),
    [addBoardGameSuccessAction.type]: (state, action: PayloadAction<{ id: number; request: AddBoardGameRequest }>) => {
        const { id, request } = action.payload;
        const list = [...state.list, { id, name: request.name, createdAt: new Date() }];
        return { ...state, list, boardGameExists: true };
    },
    [getSingleBoardGameSuccessAction.type]: (state, action: PayloadAction<SingleBoardGame>) => ({
        ...state,
        single: action.payload,
    }),
    [editBoardGameSuccessAction.type]: (state, action: PayloadAction<BasicBoardGame>) => ({
        ...state,
        list: state.list.map(game => (game.id === action.payload.id ? { ...game, name: action.payload.name } : game)),
    }),
    [deleteBoardGameSuccessAction.type]: (state, action: PayloadAction<DeleteBoardGameRequest>) => {
        const list = state.list.filter(game => game.id !== action.payload.id);
        return {
            ...state,
            list: list,
            boardGameExists: !!list.length,
        };
    },
});
