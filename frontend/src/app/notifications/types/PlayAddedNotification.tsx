import React from "react";
import { PlayNotification } from "app/notifications/__models/NotificationModels";
import css from "./notification-types.module.scss";
import Button from "library/button/Button";
import Icons from "library/icons/Icons";
import Avatar from "library/avatar/Avatar";

export interface PlayAddedNotificationProps {
    data: PlayNotification;
}

// TODO add translations
const PlayAddedNotification: React.FC<PlayAddedNotificationProps> = props => {
    return (
        <div className={css.playAdded}>
            <Avatar
                image={Icons.NoImageUserIcon}
                name={props.data.creatorDisplayName}
                className={css.avatar}
                size={32}
                color="neutral"
            />

            <div className={css.infoActionsWrapper}>
                <div className={css.info}>
                    <span className={css.user}>{props.data.creatorDisplayName}</span>
                    <h5 className={css.title}>Nowa gra z Twoim udziałem</h5>
                    <div className={css.metaInfo}>
                        {props.data.position !== null && <span>Zajęte miejsce: {props.data.position}. </span>}
                        {props.data.points !== null && <span>Liczba punktów: {props.data.points}. </span>}
                    </div>
                </div>

                <div className={css.actionButtons}>
                    <Button text="Akceptuj" decoration="outlined" textSize="smallSize" />
                </div>
            </div>
        </div>
    );
};

export default PlayAddedNotification;
