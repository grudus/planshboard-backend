import { useEffect, useState } from "react";
import throttle from "lodash/throttle";

const getWidth = () => window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

export const useSize = () => {
    const [width, setWidth] = useState(getWidth());

    useEffect(() => {
        const resizeListener = () => {
            setWidth(getWidth());
        };
        window.addEventListener("resize", throttle(resizeListener, 500));

        return () => {
            window.removeEventListener("resize", resizeListener);
        };
    }, []);

    return {
        isMobile: width < 768,
        isTablet: width < 1248,
    };
};
