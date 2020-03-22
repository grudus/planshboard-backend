import React, { useState } from "react";
import { NavBarMenuListProps } from "app/nav-bar/NavBar";
import css from "app/nav-bar/mobile/mobile-nav-bar.module.scss";
import { NavLink } from "react-router-dom";
import { ReactComponent as MoreIcon } from "./more-icon.svg";
import MoreItems from "app/nav-bar/mobile/more-items/MoreItems";

const numberOfVisibleItems = 3;

export interface MobileNavBarProps extends NavBarMenuListProps {
    moreText: string;
}

const MobileNavBar: React.FC<MobileNavBarProps> = props => {
    const [moreItemsVisible, setMoreItemsVisible] = useState(false);

    const visibleItems = [...props.items].splice(0, numberOfVisibleItems);
    const hiddenItems = [...props.items].splice(numberOfVisibleItems, props.items.length);

    const openMoreItems = () => {
        !moreItemsVisible && setMoreItemsVisible(true);
    };

    const hideMoreItems = () => {
        moreItemsVisible && setMoreItemsVisible(false);
    };

    return (
        <>
            <ul className={css.menu} onClick={hideMoreItems}>
                {visibleItems.map(item => (
                    <li key={item.path} className={css.menuItem}>
                        <NavLink to={item.path} className={css.menuLink} activeClassName={css.active}>
                            {item.icon}
                            <span>{item.label}</span>
                        </NavLink>
                    </li>
                ))}
                <li className={css.menuItem} onClick={openMoreItems}>
                    <div className={css.menuLink}>
                        <MoreIcon />
                        <span>{props.moreText}</span>
                    </div>
                </li>
            </ul>
            <MoreItems
                onHide={hideMoreItems}
                visible={moreItemsVisible}
                items={hiddenItems}
                currentPath={props.currentPath}
            />
        </>
    );
};

export default React.memo(MobileNavBar);
