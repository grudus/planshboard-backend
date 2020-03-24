import { HttpDispatch } from "app/shared/store/httpRequestActions";
import { apiRoutes } from "app/routing/routes";
import { getBoardGamesSuccessAction } from "app/board-games/store/boardGameActions";

export function getBoardGamesRequest(dispatch: HttpDispatch): Promise<any> {
    return dispatch({
        type: "get",
        path: apiRoutes.boardGames.list,
        successAction: getBoardGamesSuccessAction,
    });
}
