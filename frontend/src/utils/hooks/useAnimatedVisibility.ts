import { useEffect, useState } from "react";

export function useAnimatedVisibility(shouldOpen: boolean, time: number, classWhenVisible: string) {
    const [visible, setVisible] = useState(false);
    const [visibleClass, setVisibleClass] = useState("");

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        if (shouldOpen) {
            setVisible(true);

            timeoutId = setTimeout(() => {
                setVisibleClass(classWhenVisible);
            }, 10);
        } else {
            setVisibleClass("");
            timeoutId = setTimeout(() => {
                setVisible(false);
            }, time);
        }

        return () => clearTimeout(timeoutId);
    }, [shouldOpen, time, classWhenVisible]);

    return { visible, visibleClass };
}
