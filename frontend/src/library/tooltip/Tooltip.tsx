import React from "react";
import ReactTooltip from "react-tooltip";
import css from "./tooltip.module.scss";
import { useSize } from "app/shared/hooks/useSize";

const Tooltip: React.FC = () => {
    const { isTablet } = useSize();

    return isTablet ? (
        <ReactTooltip className={css.tooltip} event="click" globalEventOff="click" />
    ) : (
        <ReactTooltip className={css.tooltip} />
    );
};

export default React.memo(Tooltip);
