import React, { useState } from "react";
import Input, { InputProps } from "library/input/Input";
import { ReactComponent as EyeIcon } from "./icon-eye.svg";
import { ReactComponent as EyeOffIcon } from "./icon-eye-off.svg";

type PasswordInputProps = InputProps;

const PasswordInput: React.FC<PasswordInputProps> = props => {
    const [passwordType, setPasswordType] = useState("password");

    const changePasswordType = () => {
        setPasswordType(passwordType === "password" ? "text" : "password");
    };

    const getPasswordIcon = React.useCallback(() => {
        return passwordType === "password" ? (
            <EyeIcon onClick={changePasswordType} />
        ) : (
            <EyeOffIcon onClick={changePasswordType} />
        );
    }, [changePasswordType, passwordType]);

    return <Input type={passwordType} actionIcon={getPasswordIcon()} {...props} />;
};

export default PasswordInput;
