import React from "react";
import { NavBarMenuListProps } from "app/nav-bar/NavBar";
import css from "./more-items.module.scss";
import { NavLink } from "react-router-dom";
import { cssIf, merge } from "utils/cssUtils";

interface MoreItemsProps extends NavBarMenuListProps {
    onHide: (event: React.MouseEvent) => void;
    visible: boolean;
}

const MoreItems: React.FC<MoreItemsProps> = props => {
    return (
        <>
            <div onClick={props.onHide} className={merge(css.clickWrapper, cssIf(css.visible, props.visible))} />
            <ul className={merge(css.menu, cssIf(css.visible, props.visible))} onClick={props.onHide}>
                {props.items.map(item => (
                    <li key={item.path} className={css.menuItem}>
                        <NavLink to={item.path} className={css.menuLink} activeClassName={css.active}>
                            {item.icon}
                            <span>{item.label}</span>
                        </NavLink>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default MoreItems;
