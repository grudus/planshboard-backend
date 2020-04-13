import { useEffect, useState } from "react";

export function useAnimatedVisibility(open: boolean, time: number, classWhenVisible: string) {
    const [visible, setVisible] = useState(false);
    const [visibleClass, setVisibleClass] = useState("");

    useEffect(() => {
        let timeoutId: any;
        if (open) {
            setVisible(true);
            timeoutId = setTimeout(() => {
                setVisibleClass(classWhenVisible);
            }, time);
        } else {
            setVisibleClass("");
            timeoutId = setTimeout(() => {
                setVisible(false);
            }, time);
        }

        return () => clearTimeout(timeoutId);
    }, [open, time, classWhenVisible]);

    return { visible, visibleClass };
}
