import React from "react";
import AuthFormWrapper from "../auth-wrapper/AuthFormWrapper";
import useTranslations from "../../locale/hooks/useTranslations";

const Login: React.FunctionComponent<any> = () => {
    const { translate } = useTranslations();
    return (
        <AuthFormWrapper>
            <h1>{translate("AUTH.LOGIN.TITLE")}</h1>
        </AuthFormWrapper>
    );
};

export default Login;
