import React, { FormEvent, useState } from "react";
import useTranslations from "app/locale/hooks/useTranslations";
import AuthFormWrapper from "app/auth/auth-wrapper/AuthFormWrapper";
import Input from "library/input/Input";
import Button from "library/button/Button";
import css from "./login.module.scss";
import image from "./login-left-3.svg";
import { ReactComponent as UserIcon } from "./icon-user.svg";
import { ReactComponent as PassIcon } from "./icon-lock.svg";
import PasswordInput from "library/password-input/PasswordInput";

const Login: React.FunctionComponent<any> = () => {
    const { translate } = useTranslations();
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const tryToLogin = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        setError(translate("AUTH.ERRORS.INVALID_LOGIN"));
        setTimeout(() => setError(""), 2000);
    };

    return (
        <AuthFormWrapper image={image} text={translate("AUTH.LOGIN.IMAGE_TITLE")}>
            <form onSubmit={tryToLogin} className={css.loginForm}>
                <h1 className={css.title}>{translate("AUTH.LOGIN.TITLE")}</h1>

                <Input
                    label={translate("AUTH.LOGIN.INPUT_LOGIN_LABEL")}
                    name="username"
                    onChange={setLogin}
                    autoFocus
                    frontIcon={<UserIcon />}
                />
                <PasswordInput
                    label={translate("AUTH.LOGIN.INPUT_PASSWORD_LABEL")}
                    name="password"
                    onChange={setPassword}
                    frontIcon={<PassIcon />}
                    error={error}
                />

                <Button textKey="AUTH.LOGIN.BUTTON" color="primary" fullWidth className={css.button} type="submit" />
            </form>
        </AuthFormWrapper>
    );
};

export default Login;
