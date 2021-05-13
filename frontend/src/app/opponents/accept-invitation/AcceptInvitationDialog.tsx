import React, { useState } from "react";
import Dialog, { DialogProps } from "library/dialog/Dialog";
import CardFormTitle from "library/card-form/CardFormTitle";
import { NotificationItem, OpponentNotification } from "app/notifications/__models/NotificationModels";
import DialogFooter from "library/dialog/DialogFooter";
import Button from "library/button/Button";
import CardFormContent from "library/card-form/CardFormContent";
import AcceptInvitationDescription from "app/opponents/accept-invitation/AcceptInvitationDescription";
import AcceptInvitationSelectOpponent from "app/opponents/accept-invitation/AcceptInvitationSelectOpponent";
import { useHttpDispatch } from "app/shared/store/httpRequestActions";
import { acceptOpponentLinkedNotification } from "app/notifications/NotificationApi";
import { getErrorCode } from "utils/httpUtils";
import useTranslations from "app/locale/__hooks/useTranslations";

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
    const dispatch = useHttpDispatch();
    const { translate } = useTranslations();

    const onConfirm = async () => {
        if (!opponent) return;
        setLoading(true);
        await acceptOpponentLinkedNotification(dispatch, { opponent, notificationId: notification.id }).catch(err => {
            setError(getErrorCode(err) ?? "");
        });
        setLoading(false);
        props.onCancel?.();
    };

    const creatorDisplayName = notification.eventData.creatorDisplayName;

    return (
        <Dialog {...dialogProps} mobileFull>
            <CardFormTitle>{translate("NOTIFICATIONS.ACCEPT_LINKED.HEADER")}</CardFormTitle>
            <CardFormContent>
                <AcceptInvitationDescription creatorDisplayName={creatorDisplayName} />
                <AcceptInvitationSelectOpponent
                    onChange={setOpponent}
                    creatorDisplayName={creatorDisplayName}
                    error={error}
                />
            </CardFormContent>

            <DialogFooter>
                <Button text={translate("CANCEL")} decoration="outlined" onClick={props.onCancel} loading={loading} />
                <Button text={translate("ACCEPT")} onClick={onConfirm} disabled={!opponent} loading={loading} />
            </DialogFooter>
        </Dialog>
    );
};

export default AcceptInvitationDialog;
