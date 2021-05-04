import React from "react";
import IconButton from "library/icon-button/IconButton";
import Icons from "library/icons/Icons";
import { Menu, MenuDivider, MenuItem } from "@szhsin/react-menu";
import { NotificationAction, NotificationActionsDescriptor } from "app/notifications/NotificationTypesFactory";
import useTranslations from "app/locale/__hooks/useTranslations";
import css from "./notification-menu.module.scss";
import { NotificationItem } from "app/notifications/__models/NotificationModels";
import { deleteRequest, markAsReadRequest } from "app/notifications/NotificationApi";
import { HttpDispatch, useHttpDispatch } from "app/shared/store/httpRequestActions";

interface NotificationMenuProps {
    actionsDescriptor: NotificationActionsDescriptor;
    notification: NotificationItem;
}

const defaultActions: NotificationActionsDescriptor = {
    translateBase: "NOTIFICATIONS",
    actions: [
        {
            key: "MARK_AS_READ",
            svgIcon: Icons.MarkAsReadIcon,
            clickAction: (notification: NotificationItem, dispatch: HttpDispatch) =>
                markAsReadRequest(dispatch, { ids: [notification.id] }),
        },
        {
            key: "DELETE",
            svgIcon: Icons.DeleteIcon,
            clickAction: (notification: NotificationItem, dispatch: HttpDispatch) =>
                deleteRequest(dispatch, { id: notification.id }),
        },
    ],
};

const NotificationMenu: React.FC<NotificationMenuProps> = props => {
    const { translate } = useTranslations();
    const dispatch = useHttpDispatch();

    const onItemClick = (action: NotificationAction) => {
        action.clickAction?.(props.notification, dispatch);
    };

    const NotificationMenuItem = (action: NotificationAction, translateBase: string) => (
        <MenuItem key={action.key} className={css.menuItem} onClick={() => onItemClick(action)}>
            {action.svgIcon}
            {translate(`${translateBase}.${action.key}`)}
        </MenuItem>
    );

    const createMenuItems = (descriptor: NotificationActionsDescriptor) =>
        descriptor.actions.map(action => NotificationMenuItem(action, descriptor.translateBase));

    const MenuItems = props.actionsDescriptor.actions.length
        ? [
              ...createMenuItems(props.actionsDescriptor),
              <MenuDivider key="divider" />,
              ...createMenuItems(defaultActions),
          ]
        : createMenuItems(defaultActions);

    return (
        <Menu
            menuButton={<IconButton svgIcon={Icons.MoreVertical} />}
            className={css.notificationMenu}
            direction="left"
        >
            {MenuItems}
        </Menu>
    );
};

export default React.memo(NotificationMenu);
