import React, { useContext } from "react";
import { DialogContext } from "library/dialog/context/DialogContext";

const useDialog = () => {
    const { showDialog } = useContext(DialogContext);
    return { showDialog: React.useCallback(showDialog, []) };
};

export default useDialog;
