import React, { useEffect } from "react";
import { useRedux } from "store/rootReducer";
import { useAppDispatch } from "store/useAppDispatch";
import NotificationActions from "app/notifications/__store/notificationActions";
import UserActions from "app/user/__store/userActions";

const AppLoadedForUser: React.FC<any> = ({ children }) => {
    const token = useRedux(state => state.auth?.token);
    const dispatch = useAppDispatch({ swallowError: true });

    useEffect(() => {
        if (!token) {
            return;
        }

        dispatch(NotificationActions.fetchInitial());
        dispatch(UserActions.getCurrentUser());
    }, [token, dispatch]);

    return children;
};

export default React.memo(AppLoadedForUser);
