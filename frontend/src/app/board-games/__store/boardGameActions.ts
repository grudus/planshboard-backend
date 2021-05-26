import { BoardGame } from "app/board-games/__models/BoardGameModels";
import BoardGameApi from "app/board-games/BoardGameApi";
import { baseHttpAction, passBodyAsResponse } from "app/shared/store/httpRequestActions";
import { IdResponse } from "app/shared/models/Response";
import { AddBoardGameRequest } from "app/board-games/__models/BoardGameApiModels";

const getBoardGames = baseHttpAction<BoardGame[], void>("GET_BOARD_GAMES", BoardGameApi.getBoardGames);

const getSingleBoardGame = baseHttpAction("GET_SINGLE_BOARD_GAME", BoardGameApi.getSingleBoardGame);

const addBoardGame = baseHttpAction<BoardGame, AddBoardGameRequest, IdResponse>(
    "ADD_BOARD_GAME",
    BoardGameApi.addBoardGame,
    ({ id }, { name }) => ({ id, name, createdAt: new Date() }),
);

const editBoardGame = baseHttpAction("EDIT_BOARD_GAME", BoardGameApi.editBoardGame, passBodyAsResponse);

const deleteBoardGame = baseHttpAction("DELETE_BOARD_GAME_SUCCESS", BoardGameApi.deleteBoardGame, passBodyAsResponse);

export const BoardGameActions = {
    getBoardGames,
    getSingleBoardGame,
    addBoardGame,
    editBoardGame,
    deleteBoardGame,
};
