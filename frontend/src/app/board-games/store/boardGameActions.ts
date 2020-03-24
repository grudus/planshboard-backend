import { createAction } from "@reduxjs/toolkit";
import { BoardGameListItem } from "app/board-games/models/BoardGameModels";

export const getBoardGamesSuccessAction = createAction<BoardGameListItem[]>("GET_BOARD_GAMES_SUCCESS");
