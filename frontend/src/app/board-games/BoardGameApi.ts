import { ApiCall } from "app/shared/store/httpRequestActions";
import { apiRoutes } from "app/routing/routes";
import { AddBoardGameRequest, EditBoardGameRequest } from "app/board-games/__models/BoardGameApiModels";
import { IdRequest } from "app/shared/models/Response";

const getBoardGames: ApiCall = () => ({
    type: "get",
    path: apiRoutes.boardGame.list,
});

const getSingleBoardGame: ApiCall<IdRequest> = request => ({
    type: "get",
    path: apiRoutes.boardGame.single(request.id),
});

const addBoardGame: ApiCall<AddBoardGameRequest> = request => ({
    type: "post",
    path: apiRoutes.boardGame.list,
    body: request,
});

const editBoardGame: ApiCall<EditBoardGameRequest> = request => ({
    type: "put",
    path: apiRoutes.boardGame.single(request.id),
    body: request,
});

const deleteBoardGame: ApiCall<IdRequest> = request => ({
    type: "delete",
    path: apiRoutes.boardGame.single(request.id),
    body: request,
});

const BoardGameApi = {
    getBoardGames,
    getSingleBoardGame,
    addBoardGame,
    editBoardGame,
    deleteBoardGame,
};

export default BoardGameApi;
