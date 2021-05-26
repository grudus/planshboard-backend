import { CurrentUser } from "app/user/__models/UserModels";
import { baseHttpAction } from "app/shared/store/httpRequestActions";
import UserApi from "app/user/UserApi";

const getCurrentUser = baseHttpAction<CurrentUser, void>("GET_CURRENT_USER", UserApi.getCurrent);

const UserActions = {
    getCurrentUser,
};

export default UserActions;
