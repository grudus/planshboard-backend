import React from "react";
import { PlayNotification } from "app/notifications/__models/NotificationModels";
import css from "./notification-types.module.scss";
import Button from "library/button/Button";

export interface PlayAddedNotificationProps {
    data: PlayNotification;
}

// TODO add translations
const PlayAddedNotification: React.FC<PlayAddedNotificationProps> = props => {
    return (
        <div className={css.playAdded}>
            <div className={css.info}>
                <span>
                    Użytkownik <span className={css.bold}>{props.data.creatorDisplayName}</span> dodał grę z Twoim
                    udziałem.
                </span>
                {props.data.position !== null && <span> Jesteś na {props.data.position}. miejscu. </span>}
                {props.data.points !== null && <span> Twój wynik to {props.data.points} punktów. </span>}
            </div>

            <div className={css.actionButtons}>
                <Button text="Akceptuj" decoration="outlined" />
                <Button text="Odrzuć" decoration="outlined" color="normal" />
            </div>
        </div>
    );
};

export default PlayAddedNotification;
