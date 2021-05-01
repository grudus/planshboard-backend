import React, { useState } from "react";
import { DialogProps } from "library/dialog/Dialog";

type DialogElem = React.ReactElement<DialogProps>;

export interface DialogContextProps {
    showDialog: (dialog: DialogElem) => void;
}

export const DialogContext = React.createContext<DialogContextProps>({
    showDialog: () => null,
});

export const DialogProvider: React.FC = props => {
    const [dialogs, setDialogs] = useState<{ id: number; dialog: DialogElem }[]>([]);
    const [maxId, setMaxId] = useState(0);

    const showDialog = (dialog: DialogElem) => {
        const newId = maxId + 1;

        const onClose = () => {
            const dialogToClose = React.cloneElement(dialog, { open: false, key: newId });
            setDialogs(_dialogs => _dialogs.map(dd => (dd.id === newId ? { id: newId, dialog: dialogToClose } : dd)));
            setTimeout(() => {
                setDialogs(_dialogs => _dialogs.filter(({ id }) => id !== newId));
            }, 125);
        };

        const boundDialog = React.cloneElement(dialog, { onCancel: onClose, key: newId });

        setDialogs([...dialogs, { id: newId, dialog: boundDialog }]);
        setMaxId(newId);
    };

    return (
        <DialogContext.Provider value={{ showDialog }}>
            {dialogs.map(({ dialog, id }) => dialog)}
            {props.children}
        </DialogContext.Provider>
    );
};
