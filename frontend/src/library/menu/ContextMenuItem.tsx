import React, { MouseEvent } from "react";
import { MenuItem, MenuItemProps } from "@szhsin/react-menu";
import css from "./context-menu.module.scss";
import useTranslations from "app/locale/__hooks/useTranslations";
import hoistNonReactStatics from "hoist-non-react-statics";
import { Link, useHistory } from "react-router-dom";

export interface ContextMenuItemProps extends MenuItemProps {
    text?: string;
    svgIcon?: React.ReactNode;
}

const ContextMenuItem: React.FC<ContextMenuItemProps> = props => {
    const { translate } = useTranslations();
    const { text, svgIcon, href, ...menuItemProps } = props;
    const history = useHistory();

    const Wrapper = href ? Link : ({ children }: any) => <>{children}</>;

    const linkBasedClick = (event: MouseEvent<any>) => {
        if (!href) return;
        event.preventDefault();
        history.push(href!);
    };

    return (
        <MenuItem className={css.menuItem} onClickCapture={linkBasedClick} {...menuItemProps}>
            <Wrapper to={href!} className={href && css.link}>
                {svgIcon}
                {translate(text)}
            </Wrapper>
        </MenuItem>
    );
};

export default hoistNonReactStatics(ContextMenuItem, MenuItem);
