import { HttpDispatch } from "app/shared/store/httpRequestActions";
import { ExistsResponse, IdResponse } from "app/shared/models/Response";
import { apiRoutes } from "app/routing/routes";

interface CheckUsernameRequest {
    username: string;
}

export function checkUsernameRequest(dispatch: HttpDispatch, request: CheckUsernameRequest): Promise<ExistsResponse> {
    return dispatch({
        type: "get",
        path: apiRoutes.auth.checkUsername(request.username),
    });
}

interface RegisterRequest {
    username: string;
    password: string;
}

export function registerRequest(dispatch: HttpDispatch, request: RegisterRequest): Promise<IdResponse> {
    return dispatch({
        type: "post",
        path: apiRoutes.auth.registration,
        body: { username: request.username, password: request.password, confirmPassword: request.password },
    });
}
