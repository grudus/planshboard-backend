import React, { useState } from "react";
import ConfirmDialog from "library/dialog/confirm-dialog/ConfirmDialog";
import { DialogProps } from "library/dialog/Dialog";

export interface DeleteBoardGameDialogProps extends DialogProps {
    onConfirm: () => Promise<void>;
}

const DeleteBoardGameDialog: React.FC<DeleteBoardGameDialogProps> = props => {
    const [loading, setLoading] = useState(false);

    const onSubmit = async () => {
        setLoading(true);
        await props.onConfirm();
        setLoading(false);
        props.onCancel?.();
    };

    return (
        <ConfirmDialog
            title="BOARD_GAMES.DELETE.TITLE"
            text="BOARD_GAMES.DELETE.CONTENT"
            confirmButtonText="BOARD_GAMES.DELETE.CONFIRM_TEXT"
            cancelButtonText="BOARD_GAMES.DELETE.CANCEL_TEXT"
            loading={loading}
            {...props}
            onConfirm={onSubmit}
        />
    );
};

export default React.memo(DeleteBoardGameDialog);
