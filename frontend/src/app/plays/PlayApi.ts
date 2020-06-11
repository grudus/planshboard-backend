import { HttpDispatch } from "app/shared/store/httpRequestActions";
import { apiRoutes } from "app/routing/routes";
import { SavePlayRequest } from "app/plays/__models/PlayModels";
import { savePlaySuccessAction } from "app/plays/__store/playActions";

export function createPlayRequest(dispatch: HttpDispatch, request: SavePlayRequest): Promise<any> {
    return dispatch({
        type: "post",
        path: apiRoutes.play.create,
        successAction: savePlaySuccessAction,
        body: request,
    });
}
