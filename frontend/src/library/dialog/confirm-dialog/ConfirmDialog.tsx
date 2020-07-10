import React from "react";
import Dialog, { DialogProps } from "library/dialog/Dialog";
import DialogContent from "library/dialog/DialogContent";
import DialogFooter from "library/dialog/DialogFooter";
import Button from "library/button/Button";
import css from "./confirm-dialog.module.scss";
import CardFormTitle from "library/card-form/CardFormTitle";

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
            <DialogContent>
                <p>{props.text}</p>
            </DialogContent>
            <DialogFooter className={css.actions}>
                <Button text={props.cancelButtonText} decoration="outlined" onClick={props.onCancel} />
                <Button text={props.confirmButtonText} onClick={props.onConfirm} autoFocus loading={props.loading} />
            </DialogFooter>
        </Dialog>
    );
};

export default React.memo(ConfirmDialog);
