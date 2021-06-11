import React, { EventHandler } from "react";
import IconButton from "library/icon-button/IconButton";
import Icons from "library/icons/Icons";
import css from "app/board-games/list-item/board-game-list-item.module.scss";
import ContextMenuItem from "library/menu/ContextMenuItem";
import ContextMenu from "library/menu/ContextMenu";
import { appRoutes } from "app/routing/routes";
import { MenuDivider } from "@szhsin/react-menu";

interface BoardGameItemContextMenuProps {
    onDeleteClick: EventHandler<any>;
    gameId: number;
}

const BoardGameItemContextMenu: React.FC<BoardGameItemContextMenuProps> = props => (
    <ContextMenu menuButton={<IconButton svgIcon={Icons.MoreVertical} className={css.moreButton} />}>
        <ContextMenuItem
            text="PLAYS.ADD.TITLE"
            svgIcon={Icons.PlusIcon}
            href={`${appRoutes.plays.add}?boardGameId=${props.gameId}`}
        />
        <ContextMenuItem
            text="PLAYS.SHOW.TITLE"
            svgIcon={Icons.GridIcon}
            href={`${appRoutes.plays.list}?boardGameId=${props.gameId}`}
        />
        <MenuDivider />
        <ContextMenuItem
            text="BOARD_GAMES.EDIT.TITLE"
            svgIcon={Icons.EditIcon}
            href={appRoutes.boardGame.edit.replace(":id", `${props.gameId}`)}
        />
        <ContextMenuItem
            text="BOARD_GAMES.DELETE.CONFIRM_TEXT"
            svgIcon={Icons.DeleteIcon}
            onClick={props.onDeleteClick}
        />
    </ContextMenu>
);

export default BoardGameItemContextMenu;
