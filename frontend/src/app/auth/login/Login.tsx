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

    const tryToLogin = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        alert(`LOGIN ${login} ${password}`);
    };

    return (
        <AuthFormWrapper image={image} text={translate("AUTH.LOGIN.IMAGE_TITLE")}>
            <form onSubmit={tryToLogin} className={css.loginForm}>
                <h1 className={css.title}>{translate("AUTH.LOGIN.TITLE")}</h1>

                <Input labelKey="AUTH.LOGIN.INPUT_LOGIN_LABEL" onChange={setLogin} autoFocus frontIcon={<UserIcon />} />
                <PasswordInput
                    labelKey="AUTH.LOGIN.INPUT_PASSWORD_LABEL"
                    onChange={setPassword}
                    frontIcon={<PassIcon />}
                />

                <Button textKey="AUTH.LOGIN.BUTTON" color="primary" fullWidth className={css.button} type="submit" />
            </form>
        </AuthFormWrapper>
    );
};

export default Login;
