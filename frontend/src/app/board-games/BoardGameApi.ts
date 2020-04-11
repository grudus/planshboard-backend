import { HttpDispatch } from "app/shared/store/httpRequestActions";
import { apiRoutes } from "app/routing/routes";
import { addBoardGameSuccessAction, getBoardGamesSuccessAction } from "app/board-games/store/boardGameActions";

export function getBoardGamesRequest(dispatch: HttpDispatch): Promise<any> {
    return dispatch({
        type: "get",
        path: apiRoutes.boardGames.list,
        successAction: getBoardGamesSuccessAction,
    });
}

interface AddBoardGameRequest {
    name: string;
}

export function addBoardGameRequest(dispatch: HttpDispatch, request: AddBoardGameRequest): Promise<any> {
    return dispatch({
        type: "post",
        path: apiRoutes.boardGames.list,
        successAction: addBoardGameSuccessAction,
        body: request,
    });
}
