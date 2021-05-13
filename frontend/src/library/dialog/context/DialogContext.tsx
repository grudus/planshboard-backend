import React, { useState } from "react";
import { DialogProps } from "library/dialog/Dialog";
import css from "../dialog.module.scss";

type DialogElem = React.ReactElement<DialogProps>;

export interface DialogContextProps {
    showDialog: (dialog: DialogElem) => Promise<DialogElem>;
}

export const DialogContext = React.createContext<DialogContextProps>({
    showDialog: () => Promise.reject("Default value - should never happened"),
});

export const DialogProvider: React.FC = props => {
    const [dialogs, setDialogs] = useState<{ id: number; dialog: DialogElem }[]>([]);
    const [maxId, setMaxId] = useState(0);

    const removeDialogAfterAnimationEnds = (idToClose: number) => {
        setTimeout(() => {
            setDialogs(_dialogs => _dialogs.filter(({ id }) => id !== idToClose));
        }, parseInt(css.hideAnimationTime, 10));
    };

    const startHidingDialogAnimation = (dialog: DialogElem, newId: number) => {
        const dialogToClose = React.cloneElement(dialog, { open: false, key: newId });
        setDialogs(_dialogs => _dialogs.map(dd => (dd.id === newId ? { id: newId, dialog: dialogToClose } : dd)));
    };

    const showDialog = (dialog: DialogElem) => {
        const newId = maxId + 1;

        const onClose = () => {
            startHidingDialogAnimation(dialog, newId);
            removeDialogAfterAnimationEnds(newId);
        };

        const boundDialog = React.cloneElement(dialog, { onCancel: onClose, open: true, key: newId });

        setDialogs([...dialogs, { id: newId, dialog: boundDialog }]);
        setMaxId(newId);
        return Promise.resolve(boundDialog);
    };

    return (
        <DialogContext.Provider value={{ showDialog }}>
            {dialogs.map(({ dialog }) => dialog)}
            {props.children}
        </DialogContext.Provider>
    );
};
