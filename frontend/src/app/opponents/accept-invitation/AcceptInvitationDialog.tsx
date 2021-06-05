import React, { useState } from "react";
import Dialog, { DialogProps } from "library/dialog/Dialog";
import CardFormTitle from "library/card-form/CardFormTitle";
import { NotificationItem, OpponentNotification } from "app/notifications/__models/NotificationModels";
import DialogFooter from "library/dialog/DialogFooter";
import Button from "library/button/Button";
import CardFormContent from "library/card-form/CardFormContent";
import AcceptInvitationDescription from "app/opponents/accept-invitation/AcceptInvitationDescription";
import AcceptInvitationSelectOpponent from "app/opponents/accept-invitation/AcceptInvitationSelectOpponent";
import { getErrorCode } from "utils/httpUtils";
import useTranslations from "app/locale/__hooks/useTranslations";
import { useAppDispatch } from "store/useAppDispatch";
import NotificationActions from "app/notifications/__store/notificationActions";
import Heading from "library/text/Heading";

interface AcceptInvitationDialogProps extends DialogProps {
    notification: NotificationItem<OpponentNotification>;
}

export type SelectedOpponent =
    | {
          existingOpponentId: number;
      }
    | {
          newOpponentName: string;
      };

const AcceptInvitationDialog: React.FC<AcceptInvitationDialogProps> = props => {
    const { notification, ...dialogProps } = props;
    const [opponent, setOpponent] = useState<SelectedOpponent | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();
    const { translate } = useTranslations();

    const onConfirm = async () => {
        if (!opponent) return;
        setLoading(true);
        try {
            const notificationId = notification.id;
            await dispatch(NotificationActions.acceptOpponentLinked({ opponent, notificationId }));
            props.onCancel?.();
        } catch (e) {
            const errorKey = `OPPONENTS.ADD.ERRORS.${getErrorCode(e)}`;
            setError(translate(errorKey));
        }
        setLoading(false);
    };

    const creatorDisplayName = notification.eventData.creatorDisplayName;

    return (
        <Dialog {...dialogProps} mobileFull>
            <CardFormTitle>
                <Heading text="NOTIFICATIONS.ACCEPT_LINKED.HEADER" variant="h4" />
            </CardFormTitle>
            <CardFormContent>
                <AcceptInvitationDescription creatorDisplayName={creatorDisplayName} />
                <AcceptInvitationSelectOpponent
                    onChange={setOpponent}
                    creatorDisplayName={creatorDisplayName}
                    error={error}
                />
            </CardFormContent>

            <DialogFooter>
                <Button text="CANCEL" decoration="outlined" onClick={props.onCancel} loading={loading} />
                <Button text="ACCEPT" onClick={onConfirm} disabled={!opponent} loading={loading} />
            </DialogFooter>
        </Dialog>
    );
};

export default AcceptInvitationDialog;
