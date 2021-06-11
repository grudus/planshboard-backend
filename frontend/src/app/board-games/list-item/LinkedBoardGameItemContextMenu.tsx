import React from "react";
import ContextMenu from "library/menu/ContextMenu";
import IconButton from "library/icon-button/IconButton";
import Icons from "library/icons/Icons";
import ContextMenuItem from "library/menu/ContextMenuItem";
import css from "app/board-games/list-item/board-game-list-item.module.scss";
import { appRoutes } from "app/routing/routes";
import { MenuDivider } from "@szhsin/react-menu";

const LinkedBoardGameItemContextMenu: React.FC = () => (
    <ContextMenu menuButton={<IconButton svgIcon={Icons.MoreVertical} className={css.moreButton} />}>
        <ContextMenuItem href={appRoutes.plays.list} svgIcon={Icons.PlaysIcon} text="PLAYS.SHOW.TITLE" />
        <MenuDivider />
        <ContextMenuItem svgIcon={Icons.PlusIcon} text="BOARD_GAMES.LINKED.MERGE" />
        <ContextMenuItem svgIcon={Icons.XIcon} text="BOARD_GAMES.LINKED.REMOVE" />
    </ContextMenu>
);

export default LinkedBoardGameItemContextMenu;
