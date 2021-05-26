import { ApiCall } from "app/shared/store/httpRequestActions";
import { apiRoutes } from "app/routing/routes";
import { CheckUsernameRequest, LoginRequest, RegisterRequest } from "app/auth/__models/AuthApiModels";

const checkUsername: ApiCall<CheckUsernameRequest> = request => ({
    type: "get",
    path: apiRoutes.auth.checkUsername(request.username),
});

const register: ApiCall<RegisterRequest> = ({ username, password }) => ({
    type: "post",
    path: apiRoutes.auth.registration,
    body: { username, password, confirmPassword: password },
});

const login: ApiCall<LoginRequest> = request => ({
    type: "post",
    isForm: true,
    body: request,
    path: apiRoutes.auth.login,
});

const AuthApi = {
    checkUsername,
    register,
    login,
};

export default AuthApi;
