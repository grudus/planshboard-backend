import React from "react";
import { MenuItem, MenuItemProps } from "@szhsin/react-menu";
import css from "./context-menu.module.scss";
import useTranslations from "app/locale/__hooks/useTranslations";
import hoistNonReactStatics from "hoist-non-react-statics";
import { Link } from "react-router-dom";

export interface ContextMenuItemProps extends MenuItemProps {
    text?: string;
    svgIcon?: React.ReactNode;
}

const ContextMenuItem: React.FC<ContextMenuItemProps> = props => {
    const { translate } = useTranslations();
    const { text, svgIcon, href, ...menuItemProps } = props;

    const Wrapper = href ? Link : ({ children }: any) => <>{children}</>;

    return (
        <MenuItem className={css.menuItem} {...menuItemProps}>
            <Wrapper to={href!} className={href && css.link}>
                {svgIcon}
                {translate(text)}
            </Wrapper>
        </MenuItem>
    );
};

export default hoistNonReactStatics(ContextMenuItem, MenuItem);
