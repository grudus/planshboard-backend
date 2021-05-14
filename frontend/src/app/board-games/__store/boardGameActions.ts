import { createAction } from "@reduxjs/toolkit";
import { BoardGame, SingleBoardGame } from "app/board-games/__models/BoardGameModels";
import { AddBoardGameRequest, DeleteBoardGameRequest, EditBoardGameRequest } from "app/board-games/BoardGameApi";

export const getBoardGamesSuccessAction = createAction<BoardGame[]>("GET_BOARD_GAMES_SUCCESS");
export const getSingleBoardGameSuccessAction = createAction<SingleBoardGame>("GET_SINGLE_BOARD_GAME_SUCCESS");
export const addBoardGameSuccessAction =
    createAction<{ id: number; request: AddBoardGameRequest }>("ADD_BOARD_GAME_SUCCESS");
export const editBoardGameSuccessAction = createAction<EditBoardGameRequest>("EDIT_BOARD_GAME_SUCCESS");
export const deleteBoardGameSuccessAction = createAction<DeleteBoardGameRequest>("DELETE_BOARD_GAME_SUCCESS");
