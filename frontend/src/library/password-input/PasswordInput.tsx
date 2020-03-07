import React, { useCallback, useState } from "react";
import Input, { InputProps } from "library/input/Input";
import { ReactComponent as EyeIcon } from "./icon-eye.svg";
import { ReactComponent as EyeOffIcon } from "./icon-eye-off.svg";
import IconButton from "library/icon-button/IconButton";

type PasswordInputProps = InputProps;

const PasswordInput: React.FC<PasswordInputProps> = props => {
    const [passwordType, setPasswordType] = useState("password");

    const changePasswordType = useCallback(() => {
        setPasswordType(passwordType === "password" ? "text" : "password");
    }, [passwordType]);

    const getPasswordIcon = useCallback(() => {
        return passwordType === "password" ? (
            <IconButton onClick={changePasswordType} svgIcon={<EyeIcon />} />
        ) : (
            <IconButton onClick={changePasswordType} svgIcon={<EyeOffIcon />} />
        );
    }, [changePasswordType, passwordType]);

    return <Input type={passwordType} actionIcon={getPasswordIcon()} {...props} />;
};

export default React.memo(PasswordInput);
