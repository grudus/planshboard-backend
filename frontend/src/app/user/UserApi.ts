import { ApiCall } from "app/shared/store/httpRequestActions";
import { apiRoutes } from "app/routing/routes";

const getCurrent: ApiCall = () => ({
    type: "get",
    path: apiRoutes.user.current,
});

const UserApi = {
    getCurrent,
};

export default UserApi;
