import { createAction } from "@reduxjs/toolkit";
import { BasicBoardGame, BoardGameListItem } from "app/board-games/models/BoardGameModels";

export const getBoardGamesSuccessAction = createAction<BoardGameListItem[]>("GET_BOARD_GAMES_SUCCESS");
export const getSingleBoardGameSuccessAction = createAction<BoardGameListItem>("GET_SINGLE_BOARD_GAME_SUCCESS");
export const addBoardGameSuccessAction = createAction<BasicBoardGame>("ADD_BOARD_GAME_SUCCESS");
export const editBoardGameSuccessAction = createAction<BasicBoardGame>("EDIT_BOARD_GAME_SUCCESS");
