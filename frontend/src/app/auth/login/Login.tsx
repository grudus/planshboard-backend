import React, { FormEvent, useState } from "react";
import useTranslations from "app/locale/hooks/useTranslations";
import AuthFormWrapper from "app/auth/auth-wrapper/AuthFormWrapper";
import Input from "library/input/Input";
import Button from "library/button/Button";
import css from "./login.module.scss";
import image from "./login-left-3.svg";

const Login: React.FunctionComponent<any> = () => {
    const { translate } = useTranslations();
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    const tryToLogin = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        alert(`LOGIN ${login} ${password}`);
    };

    return (
        <AuthFormWrapper image={image} text={translate("AUTH.LOGIN.IMAGE_TITLE")}>
            <form onSubmit={tryToLogin} className={css.loginForm}>
                <h1 className={css.title}>{translate("AUTH.LOGIN.TITLE")}</h1>

                <Input placeholderKey="AUTH.LOGIN.INPUT_LOGIN_PLACEHOLDER" onChange={setLogin} autoFocus />
                <Input placeholderKey="AUTH.LOGIN.INPUT_PASSWORD_PLACEHOLDER" onChange={setPassword} />

                <Button textKey="AUTH.LOGIN.BUTTON" color="primary" fullWidth className={css.button} type="submit" />
            </form>
        </AuthFormWrapper>
    );
};

export default Login;
