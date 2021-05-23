import { createReducer, PayloadAction } from "@reduxjs/toolkit";
import { BoardGame, SingleBoardGame } from "app/board-games/__models/BoardGameModels";
import { BoardGameActions } from "app/board-games/__store/boardGameActions";
import { EditBoardGameRequest } from "app/board-games/__models/BoardGameApiModels";
import { IdRequest } from "app/shared/models/Response";

export interface BoardGameStore {
    list: BoardGame[];
    single?: SingleBoardGame;
    boardGameExists?: boolean;
}

const initialState: BoardGameStore = {
    list: [],
};

export const boardGamesReducer = createReducer<BoardGameStore>(initialState, {
    [BoardGameActions.getBoardGames.fulfilled.type]: (state, action: PayloadAction<BoardGame[]>) => ({
        ...state,
        list: action.payload,
        boardGameExists: !!action.payload.length,
    }),
    [BoardGameActions.addBoardGame.fulfilled.type]: (state, action: PayloadAction<BoardGame>) => {
        const list = [...state.list, { ...action.payload }];
        return { ...state, list, boardGameExists: true };
    },
    [BoardGameActions.getSingleBoardGame.fulfilled.type]: (state, action: PayloadAction<SingleBoardGame>) => ({
        ...state,
        single: action.payload,
    }),
    [BoardGameActions.editBoardGame.fulfilled.type]: (state, action: PayloadAction<EditBoardGameRequest>) => ({
        ...state,
        list: state.list.map(game => (game.id === action.payload.id ? { ...game, name: action.payload.name } : game)),
    }),
    [BoardGameActions.deleteBoardGame.fulfilled.type]: (state, action: PayloadAction<IdRequest>) => {
        const list = state.list.filter(game => game.id !== action.payload.id);
        return {
            ...state,
            list: list,
            boardGameExists: !!list.length,
        };
    },
});
