import React, { FormEvent, useState } from "react";
import useTranslations from "app/locale/__hooks/useTranslations";
import { Link } from "react-router-dom";
import AuthFormWrapper from "app/auth/auth-wrapper/AuthFormWrapper";
import image from "app/auth/registration/registration-left.svg";
import css from "app/auth/auth.module.scss";
import Input from "library/input/Input";
import { ReactComponent as UserIcon } from "app/auth/login/icon-user.svg";
import PasswordInput from "library/password-input/PasswordInput";
import { ReactComponent as PassIcon } from "app/auth/login/icon-lock.svg";
import Button from "library/button/Button";
import { appRoutes } from "app/routing/routes";
import RingLoading from "library/loading/RingLoading";
import AuthActions from "app/auth/__store/authActions";
import { useAppDispatch } from "store/useAppDispatch";
import Heading from "library/text/Heading";

const Registration: React.FunctionComponent<any> = () => {
    const { translate } = useTranslations();
    const dispatch = useAppDispatch();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [checkingUsername, setCheckingUsername] = useState(false);
    const [loading, setLoading] = useState(false);

    const tryToRegister = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        await dispatch(AuthActions.register({ username, password }));

        setLoading(false);
    };

    const checkUsername = async () => {
        setCheckingUsername(true);
        setUsernameError("");

        const result = await dispatch(AuthActions.checkUsername({ username }));

        setCheckingUsername(false);
        setUsernameError(result.exists ? translate("AUTH.ERRORS.USERNAME_EXISTS") : "");
    };

    return (
        <AuthFormWrapper image={image} text="AUTH.REGISTRATION.IMAGE_TITLE">
            <form onSubmit={tryToRegister} className={css.form}>
                <Heading variant="h1" center className={css.title} text="AUTH.REGISTRATION.TITLE" />
                <Input
                    label={translate("AUTH.REGISTRATION.INPUT_LOGIN_LABEL")}
                    name="username"
                    onTextChange={setUsername}
                    autoFocus
                    frontIcon={<UserIcon />}
                    error={usernameError}
                    onBlur={checkUsername}
                    actionIcon={
                        checkingUsername && (
                            <RingLoading className={css.checkUsernameLoader} borderWidth={2} size={20} />
                        )
                    }
                />
                <PasswordInput
                    label={translate("AUTH.REGISTRATION.INPUT_PASSWORD_LABEL")}
                    name="password"
                    onTextChange={setPassword}
                    frontIcon={<PassIcon />}
                />

                <Button
                    text={translate("AUTH.REGISTRATION.BUTTON")}
                    color="primary"
                    fullWidth
                    className={css.button}
                    type="submit"
                    loading={loading}
                    disabled={!username || !password || !!usernameError}
                />
            </form>

            <div className={css.footerText}>
                <p>{translate("AUTH.REGISTRATION.BOTTOM_TEXT.TEXT")}</p>
                <Link to={appRoutes.auth.login}>{translate("AUTH.REGISTRATION.BOTTOM_TEXT.LINK")}</Link>
            </div>
        </AuthFormWrapper>
    );
};

export default Registration;
