import React, { MouseEvent } from "react";
import { MenuItem, MenuItemProps } from "@szhsin/react-menu";
import css from "./context-menu.module.scss";
import useTranslations from "app/locale/__hooks/useTranslations";
import hoistNonReactStatics from "hoist-non-react-statics";

export interface ContextMenuItemProps extends MenuItemProps {
    text?: string;
    svgIcon?: React.ReactNode;
}

const ContextMenuItem: React.FC<ContextMenuItemProps> = props => {
    const { translate } = useTranslations();
    const { text, svgIcon, ...menuItemProps } = props;

    const preventDefault = (event: MouseEvent<any>) => {
        event.preventDefault();
    };

    return (
        <MenuItem className={css.menuItem} onClickCapture={preventDefault} {...menuItemProps}>
            {svgIcon}
            {translate(text)}
        </MenuItem>
    );
};

export default hoistNonReactStatics(ContextMenuItem, MenuItem);
