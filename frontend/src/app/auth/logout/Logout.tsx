import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logoutAction } from "app/auth/__store/authActions";

const Logout: React.FC = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(logoutAction());
    }, [dispatch]);
    return <></>;
};

export default Logout;
