import React from "react";
import IconButton from "library/icon-button/IconButton";
import Icons from "library/icons/Icons";
import { Menu, MenuDivider, MenuItem } from "@szhsin/react-menu";
import { NotificationAction, NotificationActionsDescriptor } from "app/notifications/NotificationTypesFactory";
import useTranslations from "app/locale/__hooks/useTranslations";
import css from "./notification-menu.module.scss";
import { NotificationItem } from "app/notifications/__models/NotificationModels";
import useDialog from "library/dialog/context/useDialog";
import { AppDispatch, useAppDispatch } from "store/useAppDispatch";
import NotificationActions from "app/notifications/__store/notificationActions";

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
            clickAction: (notification: NotificationItem, dispatch: AppDispatch) =>
                dispatch(NotificationActions.markAsRead({ ids: [notification.id] })),
        },
        {
            key: "DELETE",
            svgIcon: Icons.DeleteIcon,
            clickAction: ({ id }: NotificationItem, dispatch: AppDispatch) =>
                dispatch(NotificationActions.deleteNotification({ id })),
        },
    ],
};

const NotificationMenu: React.FC<NotificationMenuProps> = props => {
    const { translate } = useTranslations();
    const dispatch = useAppDispatch();
    const dialogContext = useDialog();

    const onItemClick = (action: NotificationAction) => {
        action.clickAction?.(props.notification, dispatch, dialogContext);
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
