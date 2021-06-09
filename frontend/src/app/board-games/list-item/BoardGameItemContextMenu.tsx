import React, { EventHandler } from "react";
import IconButton from "library/icon-button/IconButton";
import Icons from "library/icons/Icons";
import css from "app/board-games/list-item/board-game-list-item.module.scss";
import ContextMenuItem from "library/menu/ContextMenuItem";
import ContextMenu from "library/menu/ContextMenu";

interface BoardGameItemContextMenuProps {
    onDeleteClick: EventHandler<any>;
}

const BoardGameItemContextMenu: React.FC<BoardGameItemContextMenuProps> = props => (
    <ContextMenu menuButton={<IconButton svgIcon={Icons.MoreVertical} className={css.moreButton} />}>
        <ContextMenuItem
            text="BOARD_GAMES.DELETE.CONFIRM_TEXT"
            svgIcon={Icons.DeleteIcon}
            onClick={props.onDeleteClick}
        />
    </ContextMenu>
);

export default BoardGameItemContextMenu;
