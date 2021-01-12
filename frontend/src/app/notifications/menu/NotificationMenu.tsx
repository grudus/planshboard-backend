import React from "react";
import IconButton from "library/icon-button/IconButton";
import Icons from "library/icons/Icons";
import { Menu, MenuDivider, MenuItem } from "@szhsin/react-menu";
import { NotificationAction } from "app/notifications/NotificationTypesFactory";
import useTranslations from "app/locale/__hooks/useTranslations";
import css from "./notification-menu.module.scss";
import { NotificationItem } from "app/notifications/__models/NotificationModels";
import { markAsReadRequest } from "app/notifications/NotificationApi";
import { HttpDispatch, useHttpDispatch } from "app/shared/store/httpRequestActions";

interface NotificationMenuProps {
    extraActions: NotificationAction[];
    notification: NotificationItem;
}

const defaultActions: NotificationAction[] = [
    {
        translateKey: "NOTIFICATIONS.MARK_AS_READ",
        svgIcon: Icons.MarkAsReadIcon,
        clickAction: (notification: NotificationItem, dispatch: HttpDispatch) =>
            markAsReadRequest(dispatch, { ids: [notification.id] }),
    },
    {
        translateKey: "NOTIFICATIONS.DELETE",
        svgIcon: Icons.DeleteIcon,
    },
];

const NotificationMenu: React.FC<NotificationMenuProps> = props => {
    const { translate } = useTranslations();
    const dispatch = useHttpDispatch();

    const onItemClick = (action: NotificationAction) => {
        action.clickAction?.(props.notification, dispatch);
    };

    const NotificationMenuItem = (action: NotificationAction) => (
        <MenuItem key={action.translateKey} className={css.menuItem} onClick={() => onItemClick(action)}>
            {action.svgIcon}
            {translate(action.translateKey)}
        </MenuItem>
    );

    return (
        <Menu
            menuButton={<IconButton svgIcon={Icons.MoreVertical} />}
            className={css.notificationMenu}
            direction="left"
        >
            {props.extraActions.map(NotificationMenuItem)}
            <MenuDivider />
            {defaultActions.map(NotificationMenuItem)}
        </Menu>
    );
};

export default React.memo(NotificationMenu);
