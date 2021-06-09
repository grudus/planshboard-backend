import React from "react";
import { Menu, MenuProps } from "@szhsin/react-menu";
import css from "./context-menu.module.scss";

const ContextMenu = ({ children, ...menuProps }: MenuProps) => (
    <Menu className={css.notificationMenu} {...menuProps}>
        {children}
    </Menu>
);

export default ContextMenu;
