import React, { useState } from "react";
import ConfirmDialog from "library/dialog/confirm-dialog/ConfirmDialog";
import useTranslations from "app/locale/hooks/useTranslations";

export interface DeleteBoardGameDialogProps {
    open: boolean;
    onConfirm: () => Promise<void>;
    onCancel: () => void;
}

const DeleteBoardGameDialog: React.FC<DeleteBoardGameDialogProps> = props => {
    const [loading, setLoading] = useState(false);
    const { translate } = useTranslations();

    const onSubmit = async () => {
        setLoading(true);
        await props.onConfirm();
        setLoading(false);
    };

    return (
        <ConfirmDialog
            onConfirm={onSubmit}
            title={translate("BOARD_GAMES.DELETE.TITLE")}
            text={translate("BOARD_GAMES.DELETE.CONTENT")}
            confirmButtonText={translate("BOARD_GAMES.DELETE.CONFIRM_TEXT")}
            cancelButtonText={translate("BOARD_GAMES.DELETE.CANCEL_TEXT")}
            open={props.open}
            onCancel={props.onCancel}
            loading={loading}
        />
    );
};

export default React.memo(DeleteBoardGameDialog);
