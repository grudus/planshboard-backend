import AuthActions from "app/auth/__store/authActions";
import { push } from "connected-react-router";
import { appRoutes } from "app/routing/routes";
import { ActionListener } from "store/listenForActionMiddleware";
import { AppDispatch } from "store/useAppDispatch";
import { AnyAction } from "redux";

function logout(_: AnyAction, dispatch: AppDispatch) {
    dispatch(push(appRoutes.auth.login));
}

export const LogoutListener: ActionListener = [AuthActions.logout.type, logout];
