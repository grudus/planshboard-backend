import { useRedux } from "store/rootReducer";
import { enUS, pl } from "date-fns/locale";
import { format, formatDistanceToNow } from "date-fns";
import { useCallback } from "react";

export const useDateTime = () => {
    const language = useRedux(state => state.locale.language);

    const locale = language === "pl" ? pl : enUS;

    // server always returns date with the UTC offset, but without timezone info
    const dateFromServerString = useCallback((_date: string): Date => {
        return new Date(_date.toLocaleLowerCase().endsWith("z") ? _date : _date + "Z");
    }, []);

    return {
        formatDistance(_dateFrom: string) {
            return formatDistanceToNow(dateFromServerString(_dateFrom), { locale, addSuffix: true });
        },
        formatTime(_date: string) {
            return format(dateFromServerString(_date), "HH:mm");
        },
        getUtcDate(_date: string): Date {
            return dateFromServerString(_date);
        },
    };
};
