import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import AuthActions from "app/auth/__store/authActions";

const Logout: React.FC = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(AuthActions.logout());
    }, [dispatch]);
    return <></>;
};

export default Logout;
