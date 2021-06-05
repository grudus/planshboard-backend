import React from "react";
import Dialog, { DialogProps } from "library/dialog/Dialog";
import DialogFooter from "library/dialog/DialogFooter";
import Button from "library/button/Button";
import css from "./confirm-dialog.module.scss";
import CardFormTitle from "library/card-form/CardFormTitle";
import CardFormContent from "library/card-form/CardFormContent";
import Heading from "library/text/Heading";
import useTranslations from "app/locale/__hooks/useTranslations";

interface ConfirmDialogProps extends DialogProps {
    onConfirm: () => void;
    title: string;
    text: string;
    confirmButtonText: string;
    cancelButtonText: string;
    loading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = props => {
    const { translate } = useTranslations();
    return (
        <Dialog {...props}>
            <CardFormTitle>
                <Heading variant="h4" text={props.title} />
            </CardFormTitle>
            <CardFormContent>
                <p>{translate(props.text)}</p>
            </CardFormContent>
            <DialogFooter className={css.actions}>
                <Button text={props.cancelButtonText} decoration="outlined" onClick={props.onCancel} />
                <Button text={props.confirmButtonText} onClick={props.onConfirm} autoFocus loading={props.loading} />
            </DialogFooter>
        </Dialog>
    );
};

export default React.memo(ConfirmDialog);
