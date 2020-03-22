import React, { FormEvent, useState } from "react";
import useTranslations from "app/locale/hooks/useTranslations";
import AuthFormWrapper from "app/auth/auth-wrapper/AuthFormWrapper";
import Input from "library/input/Input";
import Button from "library/button/Button";
import css from "app/auth/auth.module.scss";
import image from "./login-left.svg";
import { ReactComponent as UserIcon } from "./icon-user.svg";
import { ReactComponent as PassIcon } from "./icon-lock.svg";
import PasswordInput from "library/password-input/PasswordInput";
import { useAwaitDispatch } from "app/shared/store/useAwaitDispatch";
import { tryToLoginAction } from "app/auth/store/authActions";
import { Link, useHistory } from "react-router-dom";
import { appRoutes } from "app/routing/routes";

const Login: React.FunctionComponent<any> = () => {
    const { translate } = useTranslations();
    const history = useHistory();
    const dispatch = useAwaitDispatch();

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const tryToLogin = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            setLoading(true);
            setError("");
            await dispatch({ username: login, password }, tryToLoginAction);
            history.push("/");
        } catch (e) {
            setError(translate("AUTH.ERRORS.INVALID_LOGIN"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthFormWrapper image={image} text={translate("AUTH.LOGIN.IMAGE_TITLE")}>
            <form onSubmit={tryToLogin} className={css.form}>
                <h1 className={css.title}>{translate("AUTH.LOGIN.TITLE")}</h1>

                <Input
                    label={translate("AUTH.LOGIN.INPUT_LOGIN_LABEL")}
                    name="username"
                    onTextChange={setLogin}
                    autoFocus
                    frontIcon={<UserIcon />}
                />
                <PasswordInput
                    label={translate("AUTH.LOGIN.INPUT_PASSWORD_LABEL")}
                    name="password"
                    onTextChange={setPassword}
                    frontIcon={<PassIcon />}
                    error={error}
                />

                <Button
                    text={translate("AUTH.LOGIN.BUTTON")}
                    color="primary"
                    fullWidth
                    className={css.button}
                    type="submit"
                    loading={loading}
                />
            </form>

            <div className={css.footerText}>
                <p>{translate("AUTH.LOGIN.BOTTOM_TEXT.TEXT")}</p>
                <Link to={appRoutes.auth.registration}>{translate("AUTH.LOGIN.BOTTOM_TEXT.LINK")}</Link>
            </div>
        </AuthFormWrapper>
    );
};

export default Login;
