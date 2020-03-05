import React from "react";
import useTranslations from "app/locale/hooks/useTranslations";
import AuthFormWrapper from "app/auth/auth-wrapper/AuthFormWrapper";

const Login: React.FunctionComponent<any> = () => {
    const { translate } = useTranslations();
    return (
        <AuthFormWrapper>
            <h1>{translate("AUTH.LOGIN.TITLE")}</h1>
        </AuthFormWrapper>
    );
};

export default Login;
