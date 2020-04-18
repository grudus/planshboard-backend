import { getAllOpponentsSuccessAction } from "app/opponents/__store/opponentActions";
import { HttpDispatch } from "app/shared/store/httpRequestActions";
import { apiRoutes } from "app/routing/routes";

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
        successAction: getAllOpponentsSuccessAction,
    });
}
