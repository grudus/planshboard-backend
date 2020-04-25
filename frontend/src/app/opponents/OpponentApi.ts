import {
    createOpponentSuccessAction,
    getAllOpponentsSuccessAction,
    getSingleOpponentSuccessAction,
    updateOpponentSuccessAction,
} from "app/opponents/__store/opponentActions";
import { HttpDispatch } from "app/shared/store/httpRequestActions";
import { apiRoutes } from "app/routing/routes";
import { SaveOpponentRequest } from "app/opponents/__models/OpponentModels";

export function getAllOpponentsRequest(dispatch: HttpDispatch): Promise<any> {
    return dispatch({
        type: "get",
        path: apiRoutes.opponent.list,
        successAction: getAllOpponentsSuccessAction,
    });
}

interface GetSingleOpponentRequest {
    id: number;
}
export function getSingleOpponent(dispatch: HttpDispatch, request: GetSingleOpponentRequest): Promise<any> {
    return dispatch({
        type: "get",
        path: apiRoutes.opponent.single(request.id),
        successAction: getSingleOpponentSuccessAction,
    });
}

export function createOpponentRequest(dispatch: HttpDispatch, request: SaveOpponentRequest) {
    return dispatch({
        type: "post",
        path: apiRoutes.opponent.create,
        body: request,
        successAction: createOpponentSuccessAction,
    });
}

export function updateOpponentRequest(dispatch: HttpDispatch, id: number, request: SaveOpponentRequest) {
    return dispatch({
        type: "put",
        path: apiRoutes.opponent.update(id),
        body: request,
        successAction: () => updateOpponentSuccessAction({ id, ...request }),
    });
}
