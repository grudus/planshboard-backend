import React, { ReactElement, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import css from "./nav-bar.module.scss";
import { merge } from "utils/cssUtils";

export interface NavBarMenuItem {
    path: string;
    label: string;
    icon: ReactElement;
}

export interface NavBarMenuListProps {
    items: NavBarMenuItem[];
    currentPath: string;
}

const NavBarMenuList: React.FC<NavBarMenuListProps> = props => {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const index = props.items.findIndex(item => props.currentPath.startsWith(item.path));
        setActiveIndex(index);
    }, [props.items, props.currentPath]);

    return (
        <ul className={css.menu}>
            <span className={css.activeLinkMoving} style={{ top: `${35 * activeIndex}px` }} />
            {props.items.map(item => (
                <li key={item.path} className={merge(css.menuItem)}>
                    <NavLink to={item.path} className={css.menuLink} activeClassName={css.active}>
                        {item.icon}
                        <span>{item.label}</span>
                    </NavLink>
                </li>
            ))}
        </ul>
    );
};

export default React.memo(NavBarMenuList);
