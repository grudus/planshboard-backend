import { ApiCall, HttpDispatch } from "app/shared/store/httpRequestActions";
import { ExistsResponse, IdResponse } from "app/shared/models/Response";
import { apiRoutes } from "app/routing/routes";
import { CheckUsernameRequest, RegisterRequest } from "app/auth/__models/AuthApiModels";

const checkUsername: ApiCall<CheckUsernameRequest> = request => ({
    type: "get",
    path: apiRoutes.auth.checkUsername(request.username),
});

const register: ApiCall<RegisterRequest> = ({ username, password }) => ({
    type: "post",
    path: apiRoutes.auth.registration,
    body: { username, password, confirmPassword: password },
});

const AuthApi = {
    checkUsername,
    register,
};

export default AuthApi;

export function checkUsernameRequest(dispatch: HttpDispatch, request: CheckUsernameRequest): Promise<ExistsResponse> {
    return dispatch({
        type: "get",
        path: apiRoutes.auth.checkUsername(request.username),
    });
}

export function registerRequest(dispatch: HttpDispatch, request: RegisterRequest): Promise<IdResponse> {
    return dispatch({
        type: "post",
        path: apiRoutes.auth.registration,
        body: { username: request.username, password: request.password, confirmPassword: request.password },
    });
}
