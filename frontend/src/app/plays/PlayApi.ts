import { HttpDispatch } from "app/shared/store/httpRequestActions";
import { apiRoutes } from "app/routing/routes";
import { SavePlayRequest } from "app/plays/__models/PlayModels";
import { getTagsSuccessAction, savePlaySuccessAction } from "app/plays/__store/playActions";

export function createPlayRequest(dispatch: HttpDispatch, request: SavePlayRequest): Promise<any> {
    return dispatch({
        type: "post",
        path: apiRoutes.play.create,
        successAction: savePlaySuccessAction,
        body: request,
    });
}

export function getTagsRequest(dispatch: HttpDispatch): Promise<any> {
    return dispatch({
        type: "get",
        path: apiRoutes.tags.getWithPlaysCount,
        successAction: getTagsSuccessAction,
    });
}
