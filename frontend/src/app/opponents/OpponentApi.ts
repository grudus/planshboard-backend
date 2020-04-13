import { getALlOpponentsSuccessAction } from "app/opponents/__store/opponentActions";
import { HttpDispatch } from "app/shared/store/httpRequestActions";
import { apiRoutes } from "app/routing/routes";

export function getAllOpponentsRequest(dispatch: HttpDispatch): Promise<any> {
    return dispatch({
        type: "get",
        path: apiRoutes.opponent.list,
        successAction: getALlOpponentsSuccessAction,
    });
}
