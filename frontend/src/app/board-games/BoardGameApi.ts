import { HttpDispatch } from "app/shared/store/httpRequestActions";
import { apiRoutes } from "app/routing/routes";
import {
    addBoardGameSuccessAction,
    deleteBoardGameSuccessAction,
    editBoardGameSuccessAction,
    getBoardGamesSuccessAction,
    getSingleBoardGameSuccessAction,
} from "app/board-games/__store/boardGameActions";
import { IdResponse } from "app/shared/models/Response";

export function getBoardGamesRequest(dispatch: HttpDispatch): Promise<any> {
    return dispatch({
        type: "get",
        path: apiRoutes.boardGame.list,
        successAction: getBoardGamesSuccessAction,
    });
}

interface GetSingleBoardGameRequest {
    id: number;
}

export function getSingleBoardGame(dispatch: HttpDispatch, request: GetSingleBoardGameRequest): Promise<any> {
    return dispatch({
        type: "get",
        path: apiRoutes.boardGame.single(request.id),
        successAction: getSingleBoardGameSuccessAction,
    });
}

interface AddBoardGameRequest {
    name: string;
}

export function addBoardGameRequest(dispatch: HttpDispatch, request: AddBoardGameRequest): Promise<any> {
    return dispatch({
        type: "post",
        path: apiRoutes.boardGame.list,
        successAction: (response: IdResponse) => addBoardGameSuccessAction({ ...request, ...response }),
        body: request,
    });
}

export interface EditBoardGameRequest extends AddBoardGameRequest {
    id: number;
}

export function editBoardGameRequest(dispatch: HttpDispatch, request: EditBoardGameRequest): Promise<any> {
    return dispatch({
        type: "put",
        path: apiRoutes.boardGame.single(request.id),
        successAction: () => editBoardGameSuccessAction(request),
        body: request,
    });
}

export interface DeleteBoardGameRequest {
    id: number;
}

export function deleteBoardGameRequest(dispatch: HttpDispatch, request: DeleteBoardGameRequest): Promise<any> {
    return dispatch({
        type: "delete",
        path: apiRoutes.boardGame.single(request.id),
        successAction: () => deleteBoardGameSuccessAction(request),
        body: request,
    });
}
