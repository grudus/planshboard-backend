import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import css from "app/nav-bar/desktop/desktop-nav-bar.module.scss";
import { merge } from "utils/cssUtils";
import { NavBarMenuListProps } from "app/nav-bar/NavBar";

const DesktopNavBar: React.FC<NavBarMenuListProps> = props => {
    const [activeIndex, setActiveIndex] = useState(0);
    const menuItemHeight = parseInt(css.menuItemHeight, 10);

    useEffect(() => {
        const index = props.items.findIndex(item => props.currentPath.startsWith(item.path));
        setActiveIndex(index);
    }, [props.items, props.currentPath]);

    return (
        <ul className={css.menu}>
            <span className={css.activeLinkMoving} style={{ top: `${menuItemHeight * activeIndex}px` }} />
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

export default React.memo(DesktopNavBar);
