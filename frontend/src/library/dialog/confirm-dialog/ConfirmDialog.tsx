import React from "react";
import Dialog, { DialogProps } from "library/dialog/Dialog";
import DialogFooter from "library/dialog/DialogFooter";
import Button from "library/button/Button";
import css from "./confirm-dialog.module.scss";
import CardFormTitle from "library/card-form/CardFormTitle";
import CardFormContent from "library/card-form/CardFormContent";

interface ConfirmDialogProps extends DialogProps {
    onConfirm: () => void;
    title: string;
    text: string;
    confirmButtonText: string;
    cancelButtonText: string;
    loading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = props => {
    return (
        <Dialog {...props}>
            <CardFormTitle>
                <h1>{props.title}</h1>
            </CardFormTitle>
            <CardFormContent>
                <p>{props.text}</p>
            </CardFormContent>
            <DialogFooter className={css.actions}>
                <Button text={props.cancelButtonText} decoration="outlined" onClick={props.onCancel} />
                <Button text={props.confirmButtonText} onClick={props.onConfirm} autoFocus loading={props.loading} />
            </DialogFooter>
        </Dialog>
    );
};

export default React.memo(ConfirmDialog);
