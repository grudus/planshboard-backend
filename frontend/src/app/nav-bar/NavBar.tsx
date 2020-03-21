import React, { ReactNode } from "react";
import { appRoutes, routesWithoutNav } from "app/routing/routes";
import useTranslations from "app/locale/hooks/useTranslations";
import NavBarMenuList, { NavBarMenuItem } from "app/nav-bar/NavBarMenuList";
import { ReactComponent as BoardGamesIcon } from "./icons/board-games.svg";
import { ReactComponent as StatsIcon } from "./icons/stats.svg";
import { ReactComponent as PlaysIcon } from "./icons/plays.svg";
import { ReactComponent as NotificationsIcon } from "./icons/notifications.svg";
import { ReactComponent as SettingsIcon } from "./icons/settings.svg";
import { ReactComponent as RankingIcon } from "./icons/ranking.svg";
import css from "./nav-bar.module.scss";
import { useLocation } from "react-router-dom";

function menu(translate: Function): NavBarMenuItem[] {
    return [
        { path: appRoutes.boardGames.list, label: translate("NAV_BAR.BOARD_GAMES"), icon: <BoardGamesIcon /> },
        { path: appRoutes.plays, label: translate("NAV_BAR.PLAYS"), icon: <PlaysIcon /> },
        { path: appRoutes.stats, label: translate("NAV_BAR.STATS"), icon: <StatsIcon /> },
        { path: appRoutes.ranking, label: translate("NAV_BAR.RANKING"), icon: <RankingIcon /> },
        { path: appRoutes.notifications, label: translate("NAV_BAR.NOTIFICATIONS"), icon: <NotificationsIcon /> },
        { path: appRoutes.settings, label: translate("NAV_BAR.SETTINGS"), icon: <SettingsIcon /> },
    ];
}

const NavBar: React.FC<{ children: ReactNode }> = props => {
    const { translate } = useTranslations();
    const location = useLocation();
    const menuItems = menu(translate);
    const shouldHideNav = routesWithoutNav.some(route => location.pathname.startsWith(route));

    if (shouldHideNav) {
        return <>{props.children}</>;
    } else {
        return (
            <div className={css.navAppWrapper}>
                <nav className={css.topNavBar}>
                    <NavBarMenuList items={menuItems} currentPath={location.pathname} />
                </nav>
                <div>{props.children}</div>
            </div>
        );
    }
};

export default React.memo(NavBar);
