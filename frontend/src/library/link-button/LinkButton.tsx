import React from "react";
import Button, { ButtonProps } from "library/button/Button";
import { Link } from "react-router-dom";

interface LinkButtonProps extends ButtonProps {
    href: string;
}

const LinkButton: React.FC<LinkButtonProps> = props => (
    <Link to={props.href}>
        <Button {...props} />
    </Link>
);

export default React.memo(LinkButton);
