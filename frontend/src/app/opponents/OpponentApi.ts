import {
    createOpponentSuccessAction,
    getAllOpponentsSuccessAction,
    getFrequentOpponentsSuccessAction,
    getSingleOpponentSuccessAction,
    updateOpponentSuccessAction,
} from "app/opponents/__store/opponentActions";
import { HttpDispatch } from "app/shared/store/httpRequestActions";
import { apiRoutes } from "app/routing/routes";
import { Opponent, SaveOpponentRequest } from "app/opponents/__models/OpponentModels";
import { IdResponse } from "app/shared/models/Response";

export function getAllOpponentsRequest(dispatch: HttpDispatch): Promise<any> {
    return dispatch({
        type: "get",
        path: apiRoutes.opponent.list,
        successAction: getAllOpponentsSuccessAction,
    });
}
export function getFrequentOpponentsRequest(dispatch: HttpDispatch): Promise<any> {
    return dispatch({
        type: "get",
        path: apiRoutes.opponent.frequent,
        successAction: getFrequentOpponentsSuccessAction,
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

export function createOpponentRequest(dispatch: HttpDispatch, request: SaveOpponentRequest): Promise<Opponent> {
    return dispatch({
        type: "post",
        path: apiRoutes.opponent.create,
        body: request,
        successAction: ({ id }: IdResponse) => createOpponentSuccessAction({ id, name: request.opponentName }),
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
