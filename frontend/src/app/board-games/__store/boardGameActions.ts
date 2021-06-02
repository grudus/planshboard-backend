import { BoardGame, LinkedBoardGame, SingleBoardGame } from "app/board-games/__models/BoardGameModels";
import BoardGameApi from "app/board-games/BoardGameApi";
import { baseHttpAction, passBodyAsResponse } from "app/shared/store/httpRequestActions";
import { IdRequest, IdResponse } from "app/shared/models/Response";
import { AddBoardGameRequest, EditBoardGameRequest } from "app/board-games/__models/BoardGameApiModels";

const getBoardGames = baseHttpAction<BoardGame[], void>("GET_BOARD_GAMES", BoardGameApi.getBoardGames);

const getLinkedBoardGames = baseHttpAction<LinkedBoardGame[], void>(
    "GET_LINKED_BOARD_GAMES",
    BoardGameApi.getLinkedBoardGames,
);

const getSingleBoardGame = baseHttpAction<SingleBoardGame>("GET_SINGLE_BOARD_GAME", BoardGameApi.getSingleBoardGame);

const addBoardGame = baseHttpAction<BoardGame, AddBoardGameRequest, IdResponse>(
    "ADD_BOARD_GAME",
    BoardGameApi.addBoardGame,
    ({ id }, { name }) => ({ id, name, createdAt: new Date() }),
);

const editBoardGame = baseHttpAction<EditBoardGameRequest>(
    "EDIT_BOARD_GAME",
    BoardGameApi.editBoardGame,
    passBodyAsResponse,
);

const deleteBoardGame = baseHttpAction<IdRequest, IdRequest>(
    "DELETE_BOARD_GAME_SUCCESS",
    BoardGameApi.deleteBoardGame,
    passBodyAsResponse,
);

export const BoardGameActions = {
    getBoardGames,
    getSingleBoardGame,
    addBoardGame,
    editBoardGame,
    deleteBoardGame,
    getLinkedBoardGames,
};
