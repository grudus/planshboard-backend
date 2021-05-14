import { useCallback, useContext } from "react";
import { DialogContext } from "library/dialog/context/DialogContext";

const useDialog = () => {
    const { showDialog } = useContext(DialogContext);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return { showDialog: useCallback(showDialog, []) };
};

export default useDialog;
