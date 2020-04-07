import React, { ReactElement, ReactNode } from "react";
import { appRoutes, routesWithoutNav } from "app/routing/routes";
import useTranslations from "app/locale/hooks/useTranslations";
import DesktopNavBar from "app/nav-bar/desktop/DesktopNavBar";
import { ReactComponent as BoardGamesIcon } from "./icons/board-games.svg";
import { ReactComponent as StatsIcon } from "./icons/stats.svg";
import { ReactComponent as PlaysIcon } from "./icons/plays.svg";
import { ReactComponent as NotificationsIcon } from "./icons/notifications.svg";
import { ReactComponent as SettingsIcon } from "./icons/settings.svg";
import { ReactComponent as RankingIcon } from "./icons/ranking.svg";
import css from "./nav-bar.module.scss";
import { useLocation } from "react-router-dom";
import { useSize } from "app/shared/hooks/useSize";
import MobileNavBar from "app/nav-bar/mobile/MobileNavBar";

export interface NavBarMenuItem {
    path: string;
    label: string;
    icon: ReactElement;
}

export interface NavBarMenuListProps {
    items: NavBarMenuItem[];
    currentPath: string;
}

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
    const { isMobile } = useSize();

    const menuItems = menu(translate);
    const shouldHideNav = routesWithoutNav.some(route => location.pathname.startsWith(route));

    if (shouldHideNav) {
        return <>{props.children}</>;
    }
    return (
        <div className={css.navAppWrapper}>
            <nav className={css.topNavBar}>
                {isMobile ? (
                    <MobileNavBar
                        items={menuItems}
                        currentPath={location.pathname}
                        moreText={translate("NAV_BAR.MORE")}
                    />
                ) : (
                    <DesktopNavBar items={menuItems} currentPath={location.pathname} />
                )}
            </nav>
            <div className={css.childrenWrapper}>
                <div className={css.childrenTopSpace} />
                {props.children}
            </div>
        </div>
    );
};

export default React.memo(NavBar);
