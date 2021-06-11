import React, { ReactElement, ReactNode } from "react";
import { appRoutes, routesWithoutNav } from "app/routing/routes";
import useTranslations from "app/locale/__hooks/useTranslations";
import DesktopNavBar from "app/nav-bar/desktop/DesktopNavBar";
import css from "./nav-bar.module.scss";
import { useLocation } from "react-router-dom";
import { useSize } from "app/shared/hooks/useSize";
import MobileNavBar from "app/nav-bar/mobile/MobileNavBar";
import Icons from "library/icons/Icons";

export interface NavBarMenuItem {
    path: string;
    label: string;
    icon: ReactElement;
}

export interface NavBarMenuListProps {
    items: NavBarMenuItem[];
    currentPath: string;
}

function menu(translate: (key: string) => string): NavBarMenuItem[] {
    return [
        { path: appRoutes.boardGame.list, label: translate("NAV_BAR.BOARD_GAMES"), icon: Icons.BoardGamesIcon },
        { path: appRoutes.plays.list, label: translate("NAV_BAR.PLAYS"), icon: Icons.PlaysIcon },
        { path: appRoutes.stats, label: translate("NAV_BAR.STATS"), icon: Icons.StatsIcon },
        { path: appRoutes.ranking, label: translate("NAV_BAR.RANKING"), icon: Icons.RankingIcon },
        { path: appRoutes.opponents.list, label: translate("NAV_BAR.OPPONENTS"), icon: Icons.OpponentsIcon },
        { path: appRoutes.notifications, label: translate("NAV_BAR.NOTIFICATIONS"), icon: Icons.NotificationsIcon },
        { path: appRoutes.settings, label: translate("NAV_BAR.SETTINGS"), icon: Icons.SettingsIcon },
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
            <main className={css.childrenWrapper}>
                <div className={css.childrenTopSpace} />
                {props.children}
            </main>
        </div>
    );
};

export default React.memo(NavBar);
